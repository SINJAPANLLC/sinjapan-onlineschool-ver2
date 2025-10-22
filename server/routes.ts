import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import Stripe from "stripe";
import crypto from "crypto";
import multer from "multer";
import { ObjectStorageService } from "./objectStorage";

// Initialize Stripe with secret key from environment variables
// Reference: blueprint:javascript_stripe integration
// Make Stripe optional - only initialize if key is provided
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

// Square configuration
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || '';
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || '';
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID || '';

// Ensure SESSION_SECRET is available (required for secure session tokens)
// Fail fast if SESSION_SECRET is not configured
if (!process.env.SESSION_SECRET) {
  throw new Error('Missing required environment variable: SESSION_SECRET. Admin authentication requires this for secure token signing.');
}
const SESSION_SECRET = process.env.SESSION_SECRET;

// In-memory notifications storage (replace with database later)
const notifications: any[] = [];

// In-memory featured pickup storage (replace with database later)
// Seed with initial data for demo
const featuredPickups: any[] = [
  {
    id: '1',
    postId: 'post_1',
    position: 1,
    createdAt: new Date().toISOString(),
    addedBy: 'admin'
  },
  {
    id: '2',
    postId: 'post_2',
    position: 2,
    createdAt: new Date().toISOString(),
    addedBy: 'admin'
  },
  {
    id: '3',
    postId: 'post_3',
    position: 3,
    createdAt: new Date().toISOString(),
    addedBy: 'admin'
  },
  {
    id: '4',
    postId: 'post_4',
    position: 4,
    createdAt: new Date().toISOString(),
    addedBy: 'admin'
  }
];

// Mock post database (in production, this would be Firebase/MongoDB)
const mockPostsDatabase: any = {
  'post_1': {
    id: 'post_1',
    title: "Boing boing",
    duration: "00:06",
    thumbnail: '/genre-1.png',
    userId: 'user_1',
    userName: 'Sakura',
    userAvatar: '/logo192.png',
    userFollowers: 25300,
    likes: 32,
    bookmarks: 19,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true
  },
  'post_2': {
    id: 'post_2',
    title: "After groping her I-cup breasts with their lewdly huge areolas and interviewing her...",
    duration: "49:30",
    thumbnail: '/genre-2.png',
    userId: 'user_2',
    userName: 'Big Breasts Academy',
    userAvatar: '/logo192.png',
    userFollowers: 101600,
    likes: 11,
    bookmarks: 11,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true
  },
  'post_3': {
    id: 'post_3',
    title: "Obon Limited!! Giveaway!! [Please read carefully to the end] Special price.",
    duration: "Limited",
    thumbnail: '/genre-3.png',
    userId: 'user_3',
    userName: 'Yoga Teacher',
    userAvatar: '/logo192.png',
    userFollowers: 78900,
    likes: 57,
    bookmarks: 50,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: true
  },
  'post_4': {
    id: 'post_4',
    title: "A short elementary school teacher with big tits came to the room, so I hugged he...",
    duration: "26:31",
    thumbnail: '/genre-1.png',
    userId: 'user_4',
    userName: 'Kei',
    userAvatar: '/logo192.png',
    userFollowers: 45200,
    likes: 111,
    bookmarks: 111,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false
  },
  'post_5': {
    id: 'post_5',
    title: "Special limited edition content available now",
    duration: "55:22",
    thumbnail: '/genre-2.png',
    userId: 'user_5',
    userName: 'Premium Creator',
    userAvatar: '/logo192.png',
    userFollowers: 89300,
    likes: 245,
    bookmarks: 198,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false
  },
  'post_6': {
    id: 'post_6',
    title: "Exclusive behind the scenes footage",
    duration: "38:45",
    thumbnail: '/genre-3.png',
    userId: 'user_6',
    userName: 'Studio Content',
    userAvatar: '/logo192.png',
    userFollowers: 134500,
    likes: 89,
    bookmarks: 72,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the application
  app.use(express.json());
  
  // Basic health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Placeholder for user management routes
  app.get("/api/users", async (_req, res) => {
    res.json({ message: "User routes placeholder - MongoDB connection required" });
  });

  // Placeholder for identity verification routes
  app.get("/api/identity", async (_req, res) => {
    res.json({ message: "Identity routes placeholder - MongoDB connection required" });
  });

  // ===== Notification Management Endpoints =====
  
  // Get all notifications
  app.get("/api/notifications", (_req, res) => {
    res.json(notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  // Get user-specific notifications (for home page)
  app.get("/api/notifications/user", (_req, res) => {
    // Filter for notifications that are sent to all users or system-wide
    const userNotifications = notifications.filter(
      n => n.target === 'all' || n.category === 'admin' || n.type === 'system'
    );
    res.json(userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  // Create a new notification (admin only)
  app.post("/api/notifications", (req, res) => {
    const { type, title, message, target, priority, category } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const newNotification = {
      id: Date.now().toString(),
      type: type || 'system',
      title,
      message,
      target: target || 'all',
      priority: priority || 'medium',
      category: category || 'admin',
      status: 'sent',
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      recipients: target === 'all' ? 1000 : 1, // Mock recipient count
      readCount: 0,
      read: false
    };

    notifications.push(newNotification);
    
    res.status(201).json(newNotification);
  });

  // Delete a notification
  app.delete("/api/notifications/:id", (req, res) => {
    const { id } = req.params;
    const index = notifications.findIndex(n => n.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notifications.splice(index, 1);
    res.json({ message: "Notification deleted successfully" });
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", (req, res) => {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.read = true;
    notification.readCount = (notification.readCount || 0) + 1;
    
    res.json(notification);
  });

  // ===== Featured Pickup Management Endpoints =====

  // Get all posts (for admin selection)
  app.get("/api/posts", (_req, res) => {
    const posts = Object.values(mockPostsDatabase);
    res.json(posts);
  });

  // Get all featured pickups with post details
  app.get("/api/featured-pickup", (_req, res) => {
    const pickupsWithDetails = featuredPickups
      .map(pickup => {
        const post = mockPostsDatabase[pickup.postId];
        if (!post) return null;
        return {
          ...pickup,
          post
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => a.position - b.position);
    
    res.json(pickupsWithDetails);
  });

  // Add a post to featured pickup
  app.post("/api/featured-pickup", (req, res) => {
    const { postId, position } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if post already exists in featured pickup
    const existingPickup = featuredPickups.find(p => p.postId === postId);
    if (existingPickup) {
      return res.status(400).json({ error: "Post already in featured pickup" });
    }

    const newPickup = {
      id: Date.now().toString(),
      postId,
      position: position || featuredPickups.length + 1,
      createdAt: new Date().toISOString(),
      addedBy: 'admin' // In production, use actual admin user ID
    };

    featuredPickups.push(newPickup);
    
    res.status(201).json(newPickup);
  });

  // Update featured pickup position
  app.patch("/api/featured-pickup/:id", (req, res) => {
    const { id } = req.params;
    const { position } = req.body;
    
    const pickup = featuredPickups.find(p => p.id === id);
    
    if (!pickup) {
      return res.status(404).json({ error: "Featured pickup not found" });
    }

    if (position !== undefined) {
      pickup.position = position;
    }
    
    res.json(pickup);
  });

  // Reorder featured pickups
  app.patch("/api/featured-pickup/reorder", (req, res) => {
    const { pickupIds } = req.body;
    
    if (!Array.isArray(pickupIds)) {
      return res.status(400).json({ error: "pickupIds must be an array" });
    }

    pickupIds.forEach((id, index) => {
      const pickup = featuredPickups.find(p => p.id === id);
      if (pickup) {
        pickup.position = index + 1;
      }
    });
    
    res.json(featuredPickups.sort((a, b) => a.position - b.position));
  });

  // Delete a featured pickup
  app.delete("/api/featured-pickup/:id", (req, res) => {
    const { id} = req.params;
    const index = featuredPickups.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Featured pickup not found" });
    }

    featuredPickups.splice(index, 1);
    
    // Reorder remaining pickups
    featuredPickups.sort((a, b) => a.position - b.position)
      .forEach((p, i) => p.position = i + 1);
    
    res.json({ message: "Featured pickup deleted successfully" });
  });

  // Object Storage Routes
  // Reference: blueprint:javascript_object_storage integration
  
  // Serve public assets from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const { ObjectStorageService } = await import("./objectStorage");
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve private objects with ACL check (for authenticated users)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
    const { ObjectPermission } = await import("./objectAcl");
    const objectStorageService = new ObjectStorageService();
    
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      
      // Try to get Firebase user ID from Authorization header
      let userId: string | undefined;
      try {
        userId = await verifyFirebaseToken(req.headers.authorization);
      } catch (error) {
        // Allow unauthenticated access for public content only
        userId = undefined;
      }
      
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.sendStatus(userId ? 403 : 401);
      }
      
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Custom error class for authentication failures
  class AuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationError';
    }
  }

  // Helper function to verify Firebase token (throws AuthenticationError if invalid/missing)
  async function verifyFirebaseToken(authHeader: string | undefined): Promise<string> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    try {
      const { auth } = await import('./firebase');
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken.uid;
    } catch (error) {
      console.error("Firebase token verification failed:", error);
      throw new AuthenticationError('Invalid authentication token');
    }
  }

  // Get upload URL for new content (video/image) - requires authentication
  app.post("/api/objects/upload", async (req, res) => {
    try {
      // Verify Firebase authentication
      const userId = await verifyFirebaseToken(req.headers.authorization);

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const { fileType, visibility = 'public' } = req.body;
      const uploadURL = await objectStorageService.getObjectEntityUploadURL(fileType, visibility);
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update content metadata after upload (set ACL policy and save to Firestore)
  app.put("/api/content/upload-complete", async (req, res) => {
    if (!req.body.contentURL) {
      return res.status(400).json({ error: "contentURL is required" });
    }

    try {
      // Verify Firebase authentication
      const userId = await verifyFirebaseToken(req.headers.authorization);

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const { visibility = 'public', contentType, title, postId, aclRules } = req.body;

      let objectPath: string;
      let storagePath: string;

      // Try to set ACL policy, but continue if it fails
      try {
        objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
          req.body.contentURL,
          {
            owner: userId,
            visibility: visibility,
            aclRules: aclRules || undefined,
          },
        );

        // Get the actual storage path for reference
        const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
        storagePath = `gs://${objectFile.bucket.name}/${objectFile.name}`;
        
        // Note: makePublic() is not available due to Public Access Prevention on Replit Object Storage
        // Files will be accessed via signed URLs or ACL policies instead
        console.log('File uploaded to:', objectPath, 'Visibility:', visibility);
      } catch (aclError) {
        console.error("Warning: ACL setting failed, using URL as-is:", aclError);
        // Fallback: use the normalized path from URL
        objectPath = objectStorageService.normalizeObjectEntityPath(req.body.contentURL);
        storagePath = req.body.contentURL;
      }

      // Save metadata to Firestore
      const { firestore, admin } = await import('./firebase');
      
      const contentMetadata = {
        objectPath,           // Normalized path: /objects/<uuid>.<ext>
        storagePath,          // Actual GCS path: gs://bucket/path or URL
        contentType,
        title: title || 'Untitled',
        owner: userId,
        visibility,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        postId: postId || null,
      };

      // Save to Firestore content_uploads collection with better error handling
      let contentDoc;
      try {
        contentDoc = await firestore.collection('content_uploads').add(contentMetadata);
      } catch (firestoreError) {
        console.error("Firestore save error:", firestoreError);
        // Return success even if Firestore save fails - file is uploaded
        return res.status(200).json({
          objectPath: objectPath,
          contentId: null,
          message: "Content uploaded successfully (metadata save pending)",
          warning: "Metadata not saved to database",
        });
      }

      res.status(200).json({
        objectPath: objectPath,
        contentId: contentDoc.id,
        message: "Content uploaded and metadata saved successfully",
      });
    } catch (error) {
      console.error("Error in upload-complete:", error);
      if (error instanceof AuthenticationError) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stripe payment route for one-time payments (subscription plan purchases)
  // Reference: blueprint:javascript_stripe integration
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment service not configured" });
      }

      const { amount, currency = "jpy", planId, planName } = req.body;
      
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      // Security: Limit maximum payment amount (100,000 yen)
      if (amount > 100000) {
        return res.status(400).json({ error: "Amount exceeds maximum limit" });
      }

      // Validate currency
      if (currency && currency !== "jpy") {
        return res.status(400).json({ error: "Only JPY currency is supported" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in yen (no need to multiply by 100 for JPY)
        currency: currency,
        metadata: {
          planId: planId || '',
          planName: planName || '',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res
        .status(500)
        .json({ error: "Error creating payment intent: " + error.message });
    }
  });

  // Secure session token generation with HMAC signature
  function generateSecureSessionToken(email: string): string {
    const timestamp = Date.now();
    const payload = `${email}:${timestamp}`;
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  function verifySecureSessionToken(token: string): { email: string; timestamp: number } | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parts = decoded.split(':');
      if (parts.length !== 3) return null;
      
      const [email, timestampStr, signature] = parts;
      const timestamp = parseInt(timestampStr);
      
      // Verify signature using the same SESSION_SECRET
      const payload = `${email}:${timestamp}`;
      const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
      
      if (signature !== expectedSignature) {
        return null; // Invalid signature
      }
      
      // Check expiration (24 hours)
      const tokenAge = Date.now() - timestamp;
      if (tokenAge > 24 * 60 * 60 * 1000) {
        return null; // Expired
      }
      
      return { email, timestamp };
    } catch {
      return null;
    }
  }

  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Verify admin credentials (environment variables for security)
      const adminEmail = process.env.ADMIN_EMAIL || "info@sinjapan.jp";
      const adminPassword = process.env.ADMIN_PASSWORD || "Kazuya8008";

      if (email === adminEmail && password === adminPassword) {
        // Generate a cryptographically signed session token
        const sessionToken = generateSecureSessionToken(email);
        
        // Set HttpOnly cookie for security (not accessible via JavaScript)
        res.cookie('adminSession', sessionToken, {
          httpOnly: true, // Not accessible via JavaScript
          secure: process.env.NODE_ENV === 'production', // HTTPS only in production
          sameSite: 'strict', // CSRF protection
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({
          success: true,
          email,
          expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error("Error during admin login:", error);
      res.status(500).json({ error: "Login error: " + error.message });
    }
  });

  // Admin authentication middleware (uses HttpOnly cookie with signature verification)
  async function verifyAdminToken(req: any, res: any, next: any) {
    try {
      // Get session token from HttpOnly cookie
      const token = req.cookies?.adminSession;
      
      if (!token) {
        return res.status(401).json({ error: "No session found" });
      }

      // Verify token signature and expiration
      const verifiedSession = verifySecureSessionToken(token);
      if (!verifiedSession) {
        res.clearCookie('adminSession');
        return res.status(401).json({ error: "Invalid or expired session" });
      }

      // Verify email matches admin email
      const adminEmail = process.env.ADMIN_EMAIL || "info@sinjapan.jp";
      if (verifiedSession.email !== adminEmail) {
        res.clearCookie('adminSession');
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Attach admin email to request object
      (req as any).adminEmail = verifiedSession.email;
      next();
    } catch (error) {
      res.clearCookie('adminSession');
      return res.status(401).json({ error: "Invalid session token" });
    }
  }

  // Verify admin session endpoint
  app.get("/api/admin/verify", verifyAdminToken, (req: any, res) => {
    res.json({ success: true, email: req.adminEmail });
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie('adminSession');
    res.json({ success: true });
  });

  // TEMPORARY: Admin endpoint to create user account
  // Protected by admin authentication
  app.post("/api/admin/create-user", verifyAdminToken, async (req, res) => {
    try {
      const { email, password, displayName } = req.body;
      
      if (!email || !password || !displayName) {
        return res.status(400).json({ error: "Email, password, and displayName are required" });
      }

      const { auth, firestore, admin } = await import('./firebase');

      // Create user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: false,
      });

      console.log('User created in Firebase Auth:', userRecord.uid);

      // Create user profile in Firestore
      await firestore.collection('users').doc(userRecord.uid).set({
        displayName,
        email,
        photoURL: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastSeen: admin.firestore.FieldValue.serverTimestamp(),
        isOnline: false,
        provider: 'email',
        stats: {
          posts: 0,
          likes: 0,
          followers: 0,
          following: 0
        },
        bio: '',
        coverImage: null,
        isVerified: false,
        subscriptionPlans: []
      });

      console.log('User profile created in Firestore');

      res.json({
        success: true,
        userId: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user: " + error.message });
    }
  });

  // Image upload endpoint for slider images
  app.post("/api/upload-slider-image", express.raw({ type: 'application/octet-stream', limit: '10mb' }), async (req, res) => {
    try {
      const multer = await import('multer');
      const storage = multer.default.memoryStorage();
      const upload = multer.default({ storage }).single('file');

      upload(req as any, res as any, async (err: any) => {
        if (err) {
          return res.status(400).json({ error: 'File upload failed' });
        }

        const file = (req as any).file;
        if (!file) {
          return res.status(400).json({ error: 'No file provided' });
        }

        const { ObjectStorageService, objectStorageClient } = await import('./objectStorage');
        const objectStorageService = new ObjectStorageService();

        // Get public search paths
        const publicPaths = objectStorageService.getPublicObjectSearchPaths();
        if (publicPaths.length === 0) {
          return res.status(500).json({ error: 'Public object storage not configured' });
        }

        // Use first public path
        const publicPath = publicPaths[0];
        const { randomUUID } = await import('crypto');
        const fileId = randomUUID();
        const extension = file.mimetype.split('/')[1];
        const fileName = `slider-${fileId}.${extension}`;
        const fullPath = `${publicPath}/${fileName}`;

        // Parse path
        const pathParts = fullPath.split('/');
        const bucketName = pathParts[1];
        const objectName = pathParts.slice(2).join('/');

        // Upload file
        const bucket = objectStorageClient.bucket(bucketName);
        const blob = bucket.file(objectName);

        const blobStream = blob.createWriteStream({
          resumable: false,
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on('error', (error: Error) => {
          console.error('Upload error:', error);
          res.status(500).json({ error: 'Error uploading file' });
        });

        blobStream.on('finish', async () => {
          // Make file public
          await blob.makePublic();

          // Return public URL
          const imageUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
          res.json({ imageUrl });
        });

        blobStream.end(file.buffer);
      });
    } catch (error: any) {
      console.error('Error in upload endpoint:', error);
      res.status(500).json({ error: 'Error uploading image: ' + error.message });
    }
  });

  // Stripe Checkout Session for Subscription
  // Reference: blueprint:javascript_stripe integration
  app.post("/api/create-subscription-checkout", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment service not configured" });
      }

      const { planId, planTitle, planPrice, creatorId, creatorName } = req.body;

      if (!planId || !planTitle || !planPrice || !creatorId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Extract creator's base price
      const priceMatch = planPrice.match(/\d+/);
      if (!priceMatch) {
        return res.status(400).json({ error: 'Invalid price format' });
      }
      const basePrice = parseInt(priceMatch[0]);
      
      // Calculate total: base price + 10% tax + 10% platform fee
      const tax = Math.floor(basePrice * 0.10); // 10% consumption tax
      const platformFee = Math.floor(basePrice * 0.10); // 10% platform fee
      const amount = basePrice + tax + platformFee; // Total amount in JPY

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: `${creatorName} - ${planTitle}`,
                description: `月額サブスクリプションプラン`,
              },
              unit_amount: amount,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/profile/${creatorId}?subscription=success&plan=${planId}`,
        cancel_url: `${req.headers.origin}/profile/${creatorId}?subscription=cancelled`,
        metadata: {
          planId,
          creatorId,
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error creating checkout session: ' + error.message });
    }
  });

  // Create Payment Intent for in-app subscription payment
  // Reference: blueprint:javascript_stripe integration
  app.post("/api/create-subscription-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Payment service not configured" });
      }

      const { planId, planTitle, planPrice, creatorId, creatorName } = req.body;

      if (!planId || !planTitle || !planPrice || !creatorId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Extract creator's base price
      const priceMatch = planPrice.match(/\d+/);
      if (!priceMatch) {
        return res.status(400).json({ error: 'Invalid price format' });
      }
      const basePrice = parseInt(priceMatch[0]);
      
      // Calculate total: base price + 10% tax + 10% platform fee
      const tax = Math.floor(basePrice * 0.10);
      const platformFee = Math.floor(basePrice * 0.10);
      const amount = basePrice + tax + platformFee; // Total amount in JPY

      // Create Payment Intent for in-app payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'jpy',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          planId,
          planTitle,
          creatorId,
          creatorName,
          basePrice: basePrice.toString(),
          tax: tax.toString(),
          platformFee: platformFee.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Error creating payment intent: ' + error.message });
    }
  });

  // Upload endpoint for document submission
  // Handles file uploads to Object Storage (private directory)
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });

  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const folder = req.query.folder as string || '.private';
      const objectStorageService = new ObjectStorageService();
      
      // Get upload URL for private storage
      const uploadUrl = await objectStorageService.getObjectEntityUploadURL(
        req.file.mimetype,
        folder === '.private' ? 'private' : 'public'
      );

      // Upload file to Object Storage using signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: req.file.buffer,
        headers: {
          'Content-Type': req.file.mimetype,
          'Content-Length': req.file.size.toString(),
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to Object Storage');
      }

      // Extract the file path from the upload URL
      const url = new URL(uploadUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      // Return the normalized object path
      const normalizedPath = `/objects/${fileName}`;

      res.json({ 
        url: normalizedPath,
        fileName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file: ' + error.message });
    }
  });

  // Square Payment endpoint for subscription payments
  app.post("/api/square-payment", async (req, res) => {
    try {
      if (!SQUARE_ACCESS_TOKEN) {
        return res.status(503).json({ error: "Square payment service not configured" });
      }

      const { sourceId, amount, planId, planName, instructorId, instructorName } = req.body;

      if (!sourceId || !amount || !planId || !instructorId) {
        return res.status(400).json({ error: 'Missing required payment fields' });
      }

      // Use Square Payments API
      const response = await fetch('https://connect.squareup.com/v2/payments', {
        method: 'POST',
        headers: {
          'Square-Version': '2024-10-17',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_id: sourceId,
          idempotency_key: crypto.randomUUID(),
          amount_money: {
            amount: amount,
            currency: 'JPY',
          },
          location_id: SQUARE_LOCATION_ID || undefined,
          note: `Subscription: ${planName} - Instructor: ${instructorName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Square payment error:', data);
        return res.status(response.status).json({ 
          error: data.errors?.[0]?.detail || 'Payment failed' 
        });
      }

      res.json({ 
        success: true,
        paymentId: data.payment.id,
        status: data.payment.status
      });
    } catch (error: any) {
      console.error('Error processing Square payment:', error);
      res.status(500).json({ error: 'Payment processing failed: ' + error.message });
    }
  });

  // Proxy endpoint for Object Storage files
  // Serves files from Object Storage while respecting visibility and ACL policies
  // Supports Range requests for video streaming
  app.get("/api/proxy/:folder/:filename", async (req, res) => {
    try {
      const { folder, filename } = req.params;
      
      // Construct object path in the format getObjectEntityFile expects: /objects/filename
      const objectPath = `/objects/${filename}`;
      
      console.log('Proxy request for:', folder, filename, 'Object path:', objectPath, 'Range:', req.headers.range);
      
      // Import ObjectStorageService
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      // Get the file from Object Storage (it will search in public/private dirs automatically)
      const file = await objectStorageService.getObjectEntityFile(objectPath);
      
      // Get file metadata
      const [metadata] = await file.getMetadata();
      const fileSize = parseInt(String(metadata.size || '0'));
      const contentType = metadata.contentType || 'application/octet-stream';
      
      // Handle Range requests for video streaming
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
        });
        
        // Stream the requested range
        file.createReadStream({ start, end })
          .on('error', (error: any) => {
            console.error('Error streaming file range:', error);
            if (!res.headersSent) {
              res.status(500).end();
            }
          })
          .pipe(res);
      } else {
        // No range request, send entire file
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000',
        });
        
        file.createReadStream()
          .on('error', (error: any) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
              res.status(500).end();
            }
          })
          .pipe(res);
      }
    } catch (error: any) {
      console.error('Error proxying file:', error);
      res.status(404).json({ error: 'File not found' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
