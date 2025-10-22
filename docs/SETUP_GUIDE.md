# セットアップガイド

## 1. Firebase設定

### 必要な環境変数

プロジェクト作成後、以下をReplitのSecretsに設定：

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=sin-japan-school.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://sin-japan-school-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=sin-japan-school
VITE_FIREBASE_STORAGE_BUCKET=sin-japan-school.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebaseコンソールでの追加設定

1. **Authentication** → Sign-in method
   - Emailを有効化
   - Googleログインを有効化（オプション）

2. **Firestore Database**
   - 「データベースを作成」
   - 本番環境モード
   - ロケーション: `asia-northeast1` (東京)

3. **Storage**
   - 「開始」をクリック
   - 本番環境モード

4. **Realtime Database** (メッセージング用)
   - 「データベースを作成」
   - ロケーション: アジア太平洋

## 2. Object Storage設定

### 環境変数
```
PUBLIC_OBJECT_SEARCH_PATHS=/sin-japan-school-media/public
PRIVATE_OBJECT_DIR=/sin-japan-school-media/protected
```

### ディレクトリ構造
バケット作成後、以下のフォルダを作成：
- `/public/course-thumbnails`
- `/public/user-avatars`
- `/protected/course-videos`
- `/protected/lesson-videos`

## 3. Square決済設定

### Sandboxテスト環境
1. [Square Developer](https://developer.squareup.com/)にアクセス
2. アプリケーション作成
3. Sandbox認証情報を取得

### 環境変数
```
SQUARE_ACCESS_TOKEN=your_sandbox_access_token
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=sandbox
```

### 本番環境への移行時
- `SQUARE_ENVIRONMENT=production`
- 本番用Access Tokenに変更
- Webhook URLを設定

## 4. 通知システム（後で設定）

### Firebase Cloud Messaging
1. Firebaseコンソール → プロジェクト設定
2. Cloud Messaging → サーバーキー
3. 環境変数に追加

### メール通知（SendGrid or Resend）
- APIキー取得
- 送信元メールアドレス設定

## 5. セキュリティ設定

### セッションSecret
```
SESSION_SECRET=your_random_secret_key
```

生成方法：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## チェックリスト

- [ ] Firebaseプロジェクト作成
- [ ] Firestore有効化
- [ ] Authentication有効化  
- [ ] Storage有効化
- [ ] Object Storageバケット作成
- [ ] 全環境変数設定
- [ ] セキュリティルールデプロイ
- [ ] Square Sandbox設定
