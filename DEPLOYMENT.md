# SIN Japan Online School Ver2 - Hostiger デプロイメントガイド

このドキュメントは、SIN Japan Online School Ver2 をHostigerにデプロイするための完全な手順を説明します。

## 📋 前提条件

- Hostigerアカウント
- GitHub アカウント
- Docker対応のHostigerプラン
- 必要な外部サービスのAPIキー（Firebase、Supabase、Stripe等）

## 🚀 デプロイ手順

### 1. GitHubリポジトリの準備

このプロジェクトは既にGitHubに配置されています：
```
https://github.com/SINJAPANLLC/sinjapan-onlineschool-ver2.git
```

### 2. 環境変数の設定

Hostigerの管理パネルで以下の環境変数を設定してください：

#### 🔧 アプリケーション基本設定
```
NODE_ENV=production
PORT=3000
APP_URL=https://your-domain.com
```

#### 🗄️ データベース設定
```
MONGODB_URI=mongodb://username:password@host:port/database_name
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

#### 🔐 認証・セキュリティ
```
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key-here
BCRYPT_ROUNDS=12
```

#### 🔥 Firebase設定
```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_API_KEY=your-web-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

#### 📊 Supabase設定
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### 🖼️ Cloudinary設定
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 💳 決済処理設定
**Stripe:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Square:**
```
SQUARE_APPLICATION_ID=your-square-app-id
SQUARE_ACCESS_TOKEN=your-square-access-token
SQUARE_LOCATION_ID=your-square-location-id
SQUARE_ENVIRONMENT=production
```

#### 🔄 Redis設定
```
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

### 3. Hostigerでのデプロイ設定

#### Docker Composeを使用する場合
1. Hostigerの管理パネルにログイン
2. 「コンテナ管理」または「Dockerアプリ」セクションに移動
3. 新しいアプリケーションを作成
4. GitHubリポジトリを接続：`https://github.com/SINJAPANLLC/sinjapan-onlineschool-ver2.git`
5. `docker-compose.yml`を選択
6. 上記の環境変数を設定
7. デプロイを開始

#### Dockerfileのみを使用する場合
1. 同じくHostigerの管理パネルで新しいアプリを作成
2. `Dockerfile`を選択
3. ビルドとデプロイを実行

### 4. ドメイン設定

1. Hostigerでカスタムドメインを設定
2. SSL証明書を有効化
3. DNS設定を更新

### 5. ヘルスチェックと監視

デプロイ後、以下のエンドポイントでアプリケーションの状態を確認：
- `https://your-domain.com/` - フロントエンドの動作確認
- `https://your-domain.com/api/health` - バックエンドAPI の動作確認（実装されている場合）

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー
```bash
# ログを確認
docker logs container_name

# 依存関係の問題の場合
npm cache clean --force
```

#### 2. 環境変数が読み込まれない
- Hostigerの管理パネルで環境変数が正しく設定されているか確認
- 変数名にタイプミスがないか確認
- アプリケーションを再起動

#### 3. データベース接続エラー
- MongoDB/PostgreSQL の接続文字列を確認
- ファイアウォール設定を確認
- データベースサーバーの稼働状況を確認

### パフォーマンス最適化

1. **Redis キャッシング**: セッション管理とデータキャッシングにRedisを使用
2. **CDN**: 静的ファイル配信にCDNを使用
3. **負荷分散**: 必要に応じてNginxリバースプロキシを設定

## 📞 サポート

デプロイに問題が発生した場合：
1. Hostigerのサポートドキュメントを参照
2. Hostigerサポートチームに連絡
3. 開発チームまでお問い合わせください

## 🔄 更新手順

コードを更新した場合：
1. GitHubに変更をプッシュ
2. Hostigerの管理パネルで手動デプロイを実行
3. または自動デプロイが設定されている場合は自動で更新

---

**注意**: 本番環境では、すべての機密情報（APIキー、パスワード等）を適切に管理し、定期的にバックアップを取ることを強く推奨します。
