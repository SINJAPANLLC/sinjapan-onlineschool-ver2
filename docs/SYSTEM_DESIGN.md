# SIN JAPAN ONLINE SCHOOL - システム設計書

## 概要
完全新規の教育プラットフォーム専用システム

## アーキテクチャ

### 1. データベース（Firestore）

#### コレクション構造

**users** - ユーザー情報
```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  photoURL: string,
  role: 'student' | 'instructor' | 'admin',
  isInstructor: boolean,
  isVerified: boolean,
  bio: string,
  phoneNumber: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // 講師専用フィールド
  instructorProfile: {
    expertise: string[],
    experience: string,
    education: string,
    certifications: string[],
    bankAccount: string,          // 暗号化
    kycStatus: 'pending' | 'approved' | 'rejected',
    kycDocuments: string[],
    totalEarnings: number,
    totalStudents: number,
    averageRating: number
  }
}
```

**courses** - コース情報
```javascript
{
  id: string,
  title: string,
  description: string,
  instructorId: string,
  instructorName: string,
  instructorAvatar: string,
  
  // 基本情報
  category: string,
  subcategory: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  language: 'ja' | 'en',
  
  // 価格・公開
  price: number,
  currency: 'JPY',
  isPaid: boolean,
  isPublished: boolean,
  publishedAt: timestamp,
  
  // メディア
  thumbnail: string,              // Object Storage URL
  coverImage: string,             // Object Storage URL
  previewVideo: string,           // Object Storage URL
  
  // コース内容
  objectives: string[],           // 学習目標
  requirements: string[],         // 前提条件
  targetAudience: string,         // 対象者
  
  // 統計
  totalEnrollments: number,
  totalCompletions: number,
  averageRating: number,
  totalReviews: number,
  totalLessons: number,
  totalDuration: number,          // 分
  
  // タイムスタンプ
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**lessons** - レッスン情報
```javascript
{
  id: string,
  courseId: string,
  title: string,
  description: string,
  orderIndex: number,
  
  // コンテンツ
  type: 'video' | 'text' | 'quiz' | 'assignment',
  videoUrl: string,               // Object Storage URL
  videoThumbnail: string,
  videoDuration: number,          // 秒
  textContent: string,            // Markdown
  resources: [{
    name: string,
    url: string,                  // Object Storage URL
    type: 'pdf' | 'zip' | 'link'
  }],
  
  // 設定
  isFree: boolean,                // プレビュー可能
  isPublished: boolean,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**enrollments** - 受講履歴
```javascript
{
  id: string,
  userId: string,
  courseId: string,
  
  // 進捗
  progress: number,               // 0-100
  completedLessons: string[],     // レッスンIDの配列
  currentLessonId: string,
  
  // 統計
  studyHours: number,
  lastAccessedAt: timestamp,
  
  // 完了
  isCompleted: boolean,
  completedAt: timestamp,
  certificateUrl: string,         // Object Storage URL
  certificateIssued: boolean,
  
  // 支払い
  paymentId: string,
  paidAmount: number,
  
  enrolledAt: timestamp
}
```

**payments** - 決済情報（Square）
```javascript
{
  id: string,
  userId: string,
  courseId: string,
  
  // Square情報
  squarePaymentId: string,
  squareOrderId: string,
  
  // 金額
  amount: number,
  currency: 'JPY',
  
  // ステータス
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  paymentMethod: 'card' | 'digital_wallet',
  
  // 詳細
  metadata: {
    instructorId: string,
    instructorEarning: number,    // 講師の取り分（70%）
    platformFee: number,          // プラットフォーム手数料（30%）
  },
  
  createdAt: timestamp,
  completedAt: timestamp
}
```

**reviews** - レビュー
```javascript
{
  id: string,
  userId: string,
  userName: string,
  userAvatar: string,
  courseId: string,
  
  rating: number,                 // 1-5
  comment: string,
  
  isPublished: boolean,
  isVerified: boolean,            // 受講完了者のみ
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**messages** - メッセージ（学生⇔講師）
```javascript
{
  id: string,
  senderId: string,
  receiverId: string,
  courseId: string,               // 関連コース（任意）
  
  content: string,
  attachments: [{
    name: string,
    url: string,                  // Object Storage URL
    type: string
  }],
  
  isRead: boolean,
  readAt: timestamp,
  
  createdAt: timestamp
}
```

**notifications** - 通知
```javascript
{
  id: string,
  userId: string,
  
  type: 'course_update' | 'new_lesson' | 'message' | 'payment' | 'review',
  title: string,
  message: string,
  
  // 関連情報
  relatedId: string,              // コースID、メッセージIDなど
  relatedType: string,
  actionUrl: string,
  
  // 配信チャンネル
  channels: ['push', 'email', 'in-app'],
  
  // ステータス
  isRead: boolean,
  readAt: timestamp,
  
  createdAt: timestamp
}
```

### 2. Object Storage

#### バケット構造
```
/sin-japan-school-media
├── /public
│   ├── /course-thumbnails
│   ├── /course-covers
│   ├── /user-avatars
│   └── /certificates
│
├── /protected
│   ├── /course-videos
│   ├── /lesson-videos
│   └── /course-materials
│
└── /private
    ├── /kyc-documents
    └── /invoices
```

### 3. Square決済フロー

```
1. ユーザーがコース購入
2. Square Payment API呼び出し
3. 決済成功 → Firestore payments作成
4. enrollments作成
5. 講師の収益に70%加算
6. 通知送信（購入完了、講師へ売上通知）
```

### 4. セキュリティルール

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ユーザーは自分のデータのみ読み書き可能
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // コースは公開されているものは誰でも閲覧可能
    match /courses/{courseId} {
      allow read: if resource.data.isPublished == true;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isInstructor == true;
      allow update, delete: if request.auth.uid == resource.data.instructorId;
    }
    
    // 受講履歴は本人のみ
    match /enrollments/{enrollmentId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // 決済情報は本人と管理者のみ
    match /payments/{paymentId} {
      allow read: if request.auth.uid == resource.data.userId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public files - 誰でも読める、認証済みユーザーは書ける
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Protected files - 受講者のみ
    match /protected/course-videos/{courseId}/{allPaths=**} {
      allow read: if request.auth != null &&
                     exists(/databases/$(database)/documents/enrollments/$(request.auth.uid + '_' + courseId));
    }
    
    // Private files - 本人と管理者のみ
    match /private/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId ||
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Admin機能

- 学生管理（一覧、詳細、停止）
- 講師管理（承認、KYC確認、停止）
- コース管理（承認、非公開化、削除）
- 決済管理（返金、収益分析）
- 通知一括送信
- レポート・分析ダッシュボード

### 6. 通知システム

#### 通知トリガー
- コース購入完了
- 新しいレッスン公開
- メッセージ受信
- レビュー投稿
- 支払い完了

#### 配信チャンネル
- プッシュ通知（Firebase Cloud Messaging）
- メール通知（SendGrid / Resend）
- アプリ内通知

## 実装順序

1. ✅ Firebase Project作成
2. ✅ Firestore初期設定
3. ✅ Authentication設定
4. ✅ Object Storage設定
5. ⬜ セキュリティルール実装
6. ⬜ Square決済統合
7. ⬜ Admin管理画面
8. ⬜ 通知システム
9. ⬜ 学習進捗トラッキング
10. ⬜ テスト・デバッグ
