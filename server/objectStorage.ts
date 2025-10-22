// Reference: blueprint:javascript_object_storage integration
// Object Storage Service for managing large video and image uploads
import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  // Search for a public object from the search paths
  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  // Downloads an object to the response
  async downloadObject(file: File, res: Response, cacheTtlSec: number = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      const aclPolicy = await getObjectAclPolicy(file);
      const isPublic = aclPolicy?.visibility === "public";
      
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `${
          isPublic ? "public" : "private"
        }, max-age=${cacheTtlSec}`,
      });

      const stream = file.createReadStream();

      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Gets the upload URL for an object entity (supports large video/image files)
  async getObjectEntityUploadURL(fileType?: string, visibility: 'public' | 'private' = 'public'): Promise<string> {
    let targetDir: string;
    
    if (visibility === 'public') {
      // Use public directory for public files
      const publicPaths = this.getPublicObjectSearchPaths();
      if (!publicPaths || publicPaths.length === 0) {
        throw new Error(
          "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
            "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var."
        );
      }
      targetDir = publicPaths[0]; // Use first public path
    } else {
      // Use private directory for private/exclusive files
      const privateObjectDir = this.getPrivateObjectDir();
      if (!privateObjectDir) {
        throw new Error(
          "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
            "tool and set PRIVATE_OBJECT_DIR env var."
        );
      }
      targetDir = privateObjectDir;
    }

    const objectId = randomUUID();
    const extension = fileType ? `.${fileType.split('/')[1]}` : '';
    const fullPath = `${targetDir}/${objectId}${extension}`;

    const { bucketName, objectName } = parseObjectPath(fullPath);

    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900, // 15 minutes for large file uploads
    });
  }

  // Gets the object entity file from the object path
  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    console.log('[getObjectEntityFile] entityId:', entityId);
    
    // Try public directories first (including legacy buckets)
    const publicPaths = this.getPublicObjectSearchPaths();
    
    // Add legacy bucket paths for backward compatibility
    const legacyBuckets = [
      'replit-objstore-f0dabea2-e8bb-40c7-baa6-c039cfa355bc/public',
      'replit-objstore-f0dabea2-e8bb-40c7-baa6-c039cfa355bc/.private'
    ];
    
    const allSearchPaths = [...publicPaths, ...legacyBuckets];
    
    for (const publicPath of allSearchPaths) {
      let entityDir = publicPath;
      if (!entityDir.endsWith("/")) {
        entityDir = `${entityDir}/`;
      }
      const objectEntityPath = `${entityDir}${entityId}`;
      const { bucketName, objectName } = parseObjectPath(objectEntityPath);
      console.log('[getObjectEntityFile] Checking bucket:', bucketName, 'object:', objectName);
      const bucket = objectStorageClient.bucket(bucketName);
      const objectFile = bucket.file(objectName);
      const [exists] = await objectFile.exists();
      console.log('[getObjectEntityFile] Exists?', exists);
      if (exists) {
        return objectFile;
      }
    }
    
    // If not found in public, try private directory
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // Handle Google Cloud Storage signed URLs
    if (rawPath.startsWith("https://storage.googleapis.com/")) {
      const url = new URL(rawPath);
      const pathParts = url.pathname.split("/").filter(part => part);
      
      // Path format: /bucket-name/object-path
      if (pathParts.length >= 2) {
        // Skip bucket name, get object path
        const objectPath = pathParts.slice(1).join("/");
        
        // Try public directories first
        const publicPaths = this.getPublicObjectSearchPaths();
        for (const publicPath of publicPaths) {
          let publicDir = publicPath;
          if (publicDir.startsWith("/")) {
            publicDir = publicDir.slice(1);
          }
          if (publicDir.endsWith("/")) {
            publicDir = publicDir.slice(0, -1);
          }
          
          // publicDir format: bucket-name/dir
          const publicDirParts = publicDir.split("/");
          if (publicDirParts.length >= 2) {
            const expectedPrefix = publicDirParts.slice(1).join("/");
            if (objectPath.startsWith(expectedPrefix + "/")) {
              const entityId = objectPath.slice(expectedPrefix.length + 1);
              return `/objects/${entityId}`;
            }
          }
        }
        
        // Try private directory
        let privateDir = this.getPrivateObjectDir();
        if (privateDir.startsWith("/")) {
          privateDir = privateDir.slice(1);
        }
        if (privateDir.endsWith("/")) {
          privateDir = privateDir.slice(0, -1);
        }
        
        // privateDir format: bucket-name/dir
        const privateDirParts = privateDir.split("/");
        if (privateDirParts.length >= 2) {
          const expectedPrefix = privateDirParts.slice(1).join("/");
          if (objectPath.startsWith(expectedPrefix + "/")) {
            const entityId = objectPath.slice(expectedPrefix.length + 1);
            return `/objects/${entityId}`;
          }
        }
      }
    }

    // If already in /objects/ format, return as-is
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }

    return rawPath;
  }

  // Tries to set the ACL policy for the object entity and return the normalized path
  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  // Checks if the user can access the object entity
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, ` +
        `make sure you're running on Replit`
    );
  }

  const { signed_url: signedURL } = await response.json();
  return signedURL;
}
