# Only-U Fans Platform

## Overview
Only-U is a social media platform connecting creators and fans, offering robust tools for content monetization and audience engagement. It features post management, real-time messaging, a comprehensive payment system, and a ranking system, aiming to be a leading platform for creator-fan interaction.

## User Preferences
I prefer iterative development with clear communication on changes. Please ask before making major architectural changes or introducing new dependencies. For UI/UX, maintain the consistent pink gradient design. Ensure all interactive elements have `data-testid` attributes for testing purposes.

## System Architecture
The platform uses a React frontend with Vite, Tailwind CSS, and Framer Motion. Internationalization is handled by i18next. The backend is built with Express.js and MongoDB (Mongoose). Firebase provides user authentication, real-time messaging, and Firestore for data management. Replit Object Storage (Google Cloud Storage-based) handles large-scale video and image uploads, supporting adult content and ACL-based access. Supabase is also integrated for additional backend services.

**Key Features:**
*   **User Authentication**: Secure login and signup.
*   **Messaging**: Real-time communication.
*   **Content Management**: Image/video posting, likes, comments, and subscriber-only content.
*   **Ranking System**: Creator and post rankings.
*   **Payment System**: Subscriptions, monetization, normal and early payment options with Stripe integration.
*   **Admin Dashboard**: Comprehensive management for users, content, revenue, reports, and analytics, featuring a consistent pink gradient design and real-time data updates.
*   **Notification System**: Push and email notifications.
*   **KYC/Identity Verification**: For creator registration.
*   **Creator Dashboard**: Analytics, post performance, and marketing tools.

**UI/UX Decisions:**
*   Consistent pink gradient design across all interactive elements, banners, and buttons.
*   Simplified header designs and smooth animations (scale, hover, pulse).
*   Responsive design and `data-testid` attributes for all interactive elements.
*   Enhanced designs for creator cards and subscription displays.

**Technical Implementations:**
*   Dynamic data display and management from Firestore.
*   **Replit Object Storage** for large-scale video/image uploads with presigned URLs, ACL policies, and adult content support.
*   Web Share API integration and `localStorage` for user-specific data.
*   Framer Motion for drag-and-drop functionality and optimized swiping for carousels.
*   Real-time messaging via Firebase Realtime Database with unread indicators.
*   Comprehensive payment calculations, including platform fees, taxes, and business day calculations.
*   Stripe SDK for secure payment processing.

## External Dependencies
*   **Firebase**: Authentication, Realtime Database, Firestore.
*   **Replit Object Storage**: Large-scale video/image storage (Google Cloud Storage-based) with adult content support.
*   **Supabase**: Additional backend services.
*   **MongoDB**: Primary database.
*   **React**: Frontend library.
*   **Vite**: Frontend build tool.
*   **Tailwind CSS**: Utility-first CSS framework.
*   **Framer Motion**: Animation library.
*   **i18next**: Internationalization framework.
*   **Headless UI**: Unstyled, accessible UI components.
*   **Express.js**: Backend web application framework.
*   **Mongoose**: MongoDB ODM.
*   **Stripe**: Payment processing.
*   **Uppy**: File upload library.

## Recent Changes

### October 20, 2025 - Firestore Performance Optimization
*   **Firestore Query Optimizations for Production Deployment**:
    - **ProfilePage.jsx**: Added `limit(50)` and `orderBy('createdAt', 'desc')` to user posts query
      - Reduced data fetching from all posts to latest 50 posts
      - Removed redundant client-side sorting (now handled by Firestore server-side)
    - **admin/Posts.jsx**: Fixed N+1 query problem with batch user data fetching
      - Implemented batch queries using `where('__name__', 'in', userIds)` pattern
      - Chunks user IDs into groups of 10 (Firestore limitation)
      - Stores user data in Map for efficient lookup
      - Performance improvement: N individual queries → ceil(N/10) batch queries
    - **feed.jsx**: Already optimized with `limit(20)` - no changes needed
    - All optimizations architect-reviewed and approved

### October 20, 2025 - Creator Registration KYC Approval Flow
*   **Creator Registration & KYC Approval System**:
    - Integrated CreatorPhoneVerificationPage with Firestore creatorApplications collection
    - Application data includes: userId, userName, furiganaFamily, furiganaFirst, address, dob, contentKind, phoneNumber, status
    - Updates users collection with creatorStatus ('not_applied', 'pending', 'approved', 'rejected') and creatorApplicationSubmittedAt timestamp
    - KYCManagement admin page fetches real-time data from creatorApplications using onSnapshot
    - Approve action updates both creatorApplications.status and users.{isCreator: true, creatorStatus: 'approved', kycStatus: 'approved'}
    - Reject action prompts for rejection reason, updates both collections accordingly
    - CreatePostPage enforces creator approval check: redirects non-approved users to registration flow
    - Loading state with spinner, status-based UI (pending/rejected/not_applied) with appropriate messaging
    - LoggedInAccountPage displays creator status card with:
      - Yellow warning for pending applications with "審査待ち" message
      - Red alert for rejected applications with "サポートにお問い合わせください" message
      - Green success for approved creators with "承認済み" badge
      - Pink gradient "クリエイター登録" button for users who haven't applied
    - Creator Dashboard card only visible to approved creators
    - All UIs use pink gradient design consistent with platform theme
*   **Admin Panel Enhancements**:
    - Removed notification bell and settings icons from admin Topbar for cleaner UI
    - Added HomeSliderManagement and TransferRequestManagement to admin sidebar
    - All admin pages use consistent pink gradient design with Framer Motion animations
*   **Featured Pickup Management Enhancement**:
    - Added search functionality to find posts by ID
    - Implemented add/remove functionality for featured posts with Firestore integration
    - Created featuredPickups collection in Firestore with createdAt timestamps
*   **Home Slider Management**:
    - Created HomeSliderManagement.jsx admin page for managing homepage slider images
    - Implemented image upload using Replit Object Storage
    - Backend endpoint `/api/upload-slider-image` for secure image uploads
    - Firestore homeSliders collection for storing slider metadata
    - Updated FeaturedCreators.jsx to load slider images from Firestore
*   **Transfer Request Management**:
    - Created TransferRequestManagement.jsx for managing creator payout requests
    - Approve/reject functionality with financial breakdown display
    - Real-time data updates using Firestore onSnapshot on transferRequests collection
*   **User Authentication Improvements**:
    - Implemented password reset functionality with Firebase sendPasswordResetEmail
    - Added password reset modal with email input and validation
    - Japanese error messages for all authentication errors (login, signup, password reset)
    - User-friendly error messages: "このメールアドレスで登録されたアカウントがありません" instead of "Firebase: Error (auth/network-request-failed)"
*   **In-App Payment with Stripe Elements**:
    - Replaced external Stripe Checkout with embedded Stripe Elements payment form
    - Created `/api/create-subscription-payment-intent` endpoint for Payment Intent creation
    - Integrated PaymentElement component in ProfilePage subscription modal
    - Pink gradient theme matching app design with Japanese labels
    - Price breakdown display: base price, 10% tax, 10% platform fee, total
*   **Video Upload Improvements**:
    - Enhanced error handling for video/image uploads to Object Storage
    - ACL setting errors no longer block uploads (graceful degradation)
    - Firestore save failures don't prevent file uploads
    - All error messages in CreatePostPage localized to Japanese
    - File type display changed from "Image/Video" to "画像/動画"
*   **Creator Dashboard - Weekly Performance Chart Enhancement**:
    - Added real-time data values display above each bar in weekly performance chart
    - Views displayed in dark pink (text-pink-600), likes in light pink (text-pink-400)
    - Implemented formatNumber function for readable values (e.g., 1.2K, 2.5K)
    - Added Framer Motion animations: staggered fade-in/slide-up on load, hover scale effect
    - Increased chart height from h-36 to h-48 for better value visibility
    - Added data-testid attributes for each bar (bar-views-月, bar-likes-月, etc.)
*   **Account Page Service Menu Enhancement**:
    - Added new "サービス・プラン" section with links to:
      - 加入中のプラン (Current Plan) - /current-plan
      - 購入履歴 (Purchase History) - /purchase-history
      - クーポン一覧 (Coupon List) - /coupons
    - Imported DollarSign, History, and Tag icons from lucide-react
*   **Only-U Exclusive Creator Feature Removal**:
    - Removed ExclusiveCreatorRegistrationPage.jsx component
    - Removed /exclusive-creator-registration route from App.jsx
    - Removed "Only-U独占クリエイター登録" button from LoggedInAccount.jsx
    - Deleted import statement for ExclusiveCreatorRegistrationPage from App.jsx
*   **Current Plan Page Firestore Integration**:
    - Integrated Firestore real-time subscription data using onSnapshot
    - Query subscriptions collection filtered by userId and status='active'
    - Added loading state with spinner animation
    - Empty state with "クリエイターを探す" button when no subscriptions found
    - Cancel subscription functionality with Firestore updateDoc
    - Optional chaining for creator.features and creator.usage to handle missing data
    - Default values for avatar, billingCycle, and usage statistics
*   **Transfer Request Page Firestore Integration**:
    - Real-time transfer history display using onSnapshot on transferRequests collection
    - Bank account information fetching from bankAccounts collection
    - Transfer request submission to Firestore with complete fee breakdown
    - Loading state with spinner, bank account missing state with registration prompt
    - Proper cleanup of onSnapshot listener on component unmount
    - Empty state display when no transfer history exists
    - Supports both normal and early payment transfer types
*   **Bank Account Registration Page Firestore Integration**:
    - Save bank account details to bankAccounts collection in Firestore
    - Stores bankName, branchName, accountType, accountNumber, accountHolder
    - Success state with navigation to transfer request page
    - Error handling with user-friendly error messages
*   **Creator Ranking Page Firestore Integration**:
    - Fetch creators from Firestore users collection ordered by followers count
    - Real-time updates using onSnapshot
    - Loading state with spinner animation
    - Empty state display when no creators found
    - Conditional rendering of Top 3 section (only when >= 3 creators exist)
    - Proper cleanup of onSnapshot listener
*   **My Posts Page Firestore Integration**:
    - Fetch user's posts from Firestore posts collection filtered by userId
    - Real-time updates using onSnapshot
    - Display statistics: total posts, total views, total earnings
    - Loading state and empty state handling
    - Proper cleanup of onSnapshot listener
*   **Post Comments Page Firestore Integration**:
    - Fetch posts from Firestore posts collection filtered by userId
    - Fetch comments from Firestore comments collection filtered by postUserId
    - Two separate useEffect hooks with onSnapshot listeners
    - Real-time updates for both posts and comments
    - Proper cleanup of both onSnapshot listeners
*   **Sales Management Page Firestore Integration**:
    - Fetch subscriptions from Firestore subscriptions collection filtered by creatorId
    - Real-time updates using onSnapshot
    - Calculate total revenue, total subscribers, and new subscribers
    - Loading state and empty state handling
    - Proper cleanup of onSnapshot listener
*   **Account Settings Pages Firestore Integration**:
    - **FollowListPage**: Firestore integration with batched queries (where('__name__', 'in', chunk)) to avoid N+1 problem, error handling, confirmation dialogs for unfollow
    - **BlockedUsersPage**: Firestore integration with blockedUsers collection, onSnapshot for real-time updates, error handling with UI error messages, confirmation dialogs for unblock/remove
    - **PersonalInfoPage**: Firestore integration with enhanced validation (display name required, date validation, empty string prevention), only updates non-empty fields to prevent data loss
    - **PhoneVerificationPage & EmailVerificationPage**: Basic UI implemented with step-by-step flow (phone/email input, code verification, success state), Firebase Auth integration pending as future enhancement
    - All pages include loading states, empty states, and comprehensive error handling with user-friendly Japanese error messages
    - All pages use pink gradient design consistent with the platform's UI/UX guidelines