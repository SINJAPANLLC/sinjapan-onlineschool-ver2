# SIN JAPAN ONLINE SCHOOL

## Overview
SIN JAPAN ONLINE SCHOOL is a comprehensive online learning platform providing quality education through professional instructors. The platform has been completely transformed from a social media/fan platform into an educational platform, featuring course catalogs, instructor dashboards, student-instructor communication, and comprehensive learning management. The platform tagline is "あなたの未来を一緒に創る" (Creating your future together).

## User Preferences
I prefer iterative development with clear communication on changes. Please ask before making major architectural changes or introducing new dependencies. For UI/UX, maintain the consistent blue gradient design throughout all pages. Ensure all interactive elements have `data-testid` attributes for testing purposes.

## System Architecture
The platform features a React frontend built with Vite, Tailwind CSS, Framer Motion for animations, and i18next for internationalization. The backend utilizes Express.js for API endpoints. **Firebase (school-ec82e project)** is the primary data store, providing user authentication, Firestore Database for all application data, Realtime Database for messaging, and Firebase Storage for user-uploaded media. Replit Object Storage (Google Cloud Storage-based) handles large course video files. Square payment integration handles all monetary transactions.

**Key Features:**
*   **User Management**: Secure authentication via Firebase, student and instructor profiles with KYC/Identity verification for instructors.
*   **Course System**: Course creation, enrollment, video lessons, learning progress tracking, ratings and reviews.
*   **Student-Instructor Communication**: Real-time messaging via Firebase Realtime Database with unread indicators.
*   **Monetization**: Course pricing, payment processing via Stripe, instructor earnings tracking, payment withdrawal system.
*   **Ranking System**: Course rankings and student leaderboards.
*   **Admin Dashboard**: Comprehensive management for students, instructors, courses, revenue, reports, and analytics.
*   **Instructor Dashboard**: Course analytics, student engagement metrics, earnings tracking, and course management.
*   **Notifications**: Push and email notifications for course updates and messages.

**Terminology Standardization:**
*   **投稿** → **コース** (Courses)
*   **クリエイター** → **講師** (Instructors)
*   **ユーザー** → **学生** (Students)
*   All pages consistently use educational terminology

**UI/UX Decisions:**
*   **Consistent blue gradient design** (`from-blue-500 to-blue-700`) across ALL pages including:
    - Main user-facing pages (Landing, Feed, Messages, Create Course, etc.)
    - Instructor Dashboard
    - Admin Dashboard and all admin sub-pages
    - Settings, Help, Search pages
    - Legal pages (Terms, Privacy Policy)
*   **Educational icons**: Graduation cap (GraduationCap), book (BookOpen), award/medal icons throughout
*   Simplified header designs with gradient backgrounds and smooth animations (scale, hover, pulse)
*   Responsive design and `data-testid` attributes for all interactive elements
*   Professional, educational look and feel throughout the entire platform

**Major Page Transformations:**
1. **Landing Page (LandingPage.jsx)**: Educational platform hero section with graduation cap branding
2. **Course Catalog (feed.jsx)**: Browse and search courses with category filtering and enrollment
3. **Messages (msg.jsx)**: Student-instructor communication platform
4. **Course Creation (CreatePostPage.jsx)**: Instructor course creation interface with lessons, objectives, and pricing
5. **Instructor Dashboard (CreatorDashboard.jsx)**: Analytics, student metrics, course performance, earnings
6. **Profile Edit (EditProfilePage.jsx)**: Student/instructor profile management with instructor registration option
7. **Admin Dashboard**: Complete redesign with blue gradient theme, educational terminology, student/instructor/course statistics
8. **Search Page (SearchPage.jsx)**: Course and instructor search with category browsing
9. **Settings (SettingsPage.jsx)**: Learning preferences, account settings, instructor settings
10. **Help Page (HelpPage.jsx)**: Educational platform help center with course-related FAQs
11. **My Courses (MyPostsPage.jsx)**: Instructor's course management page
12. **Ranking (RankingPage.jsx)**: Course rankings and student leaderboards
13. **Legal Pages**: Terms of Use and Privacy Policy updated for educational platform

**Technical Implementations:**
*   Dynamic course data display and management from Firestore
*   Replit Object Storage for course video/image uploads with presigned URLs and ACL policies
*   Web Share API integration and `localStorage` for user-specific data
*   Framer Motion for smooth page transitions and animations
*   Real-time messaging via Firebase Realtime Database
*   Comprehensive payment calculations for course pricing and instructor earnings
*   Stripe SDK for secure payment processing using embedded Stripe Elements
*   Firestore query optimizations (limiting, ordering, batching) for performance
*   Localized error messages (Japanese) for user authentication and uploads

## Recent Changes (October 22, 2025 - Latest Update)
*   **Platform Transformation**: Complete conversion from social media platform to online learning platform
*   **Terminology Update**: Standardized all references to use educational terminology (courses, instructors, students)
*   **Design Overhaul**: Applied consistent blue gradient theme across ALL pages (replaced pink gradients)
*   **🎨 COMPLETE COLOR TRANSFORMATION (October 22, 2025)**:
    - **Automated Batch Conversion**: Replaced ALL pink colors with blue across 100+ files
    - **Zero Pink Remaining**: Converted pink-50 through pink-900 to blue-50 through blue-900
    - **Files Updated**: All pages, components, Admin pages, Header, data files
    - **Gradient Conversion**: from-pink/to-pink/via-pink → from-blue/to-blue/via-blue
    - **Design Consistency**: Every page now uses consistent blue educational branding
*   **📚 COMPLETE ADMIN SYSTEM TRANSFORMATION (October 22, 2025)**:
    - **28 Admin Pages Updated**: All admin files converted to educational terminology
    - **Terminology Conversion**: 投稿→コース, クリエイター→講師, ファン→学生 across all admin pages
    - **Key Pages Completed**: Dashboard, Sidebar, Instructors, CourseManagement, Users, Analytics, KYC, Revenue, Reports
    - **Code Structure Maintained**: UI uses educational terms, backend preserves existing structure (isCreator, creatorId)
    - **Admin Features**: Student management, instructor management, course management, revenue tracking, verification, notifications
    - **Blue Theme Applied**: All admin pages use blue gradient design matching main platform
*   **Page Updates**: Transformed 13+ major pages including Feed, Messages, Dashboards, Admin, Settings, Help, Legal pages
*   **Admin Dashboard**: Redesigned with blue gradient, educational statistics, and proper terminology
*   **Instructor Features**: Enhanced course creation, dashboard analytics, and student engagement tracking
*   **Search & Discovery**: Rebuilt search page for course and instructor discovery
*   **Legal Pages**: Updated Terms of Service and Privacy Policy for educational platform
*   **Company Update**: Changed operating company from "合同会社SIN JAPAN KANAGAWA" to "合同会社SIN JAPAN"
*   **New Legal Pages**: Created Commercial Transactions (特定商取引法) and Content Guidelines pages
*   **Logo Integration**: Replaced all sample/placeholder images with official "SCHOOL SIN JAPAN" logo (`/logo-school.jpg`):
    - Course thumbnails in Home, Feed, Ranking pages
    - Instructor/student avatars in all pages
    - Profile and cover images
    - Admin panel user avatars
    - Comment and messaging system avatars
    - All placeholder images replaced with logo across 15+ files
*   **Bottom Navigation Redesign**: Completely redesigned for educational platform:
    - Changed accent color from pink/purple to blue gradient
    - Updated icons: Trophy (rankings), BookOpen (courses), GraduationCap (instructor dashboard)
    - Changed terminology: "クリエイター" → "講師" (Instructor)
    - Educational-themed navigation labels
    - Blue gradient highlights for active items
*   **Account Page Rebuild**: Fully redesigned account/profile page:
    - Dual-mode support: Student view and Instructor view
    - Student stats: Enrolled courses, completed courses, study hours, certificates
    - Instructor stats: Total courses, total students, earnings, average rating
    - Instructor registration banner for students
    - Blue gradient design throughout
    - Organized menu sections for learning management, payments, support
    - Separate instructor menu sections: Dashboard, course management, earnings, student management
    - Improved logout modal with confirmation
*   **🔥 NEW FIREBASE PROJECT (October 22, 2025)**:
    - **Migrated to dedicated Firebase project**: school-ec82e (separate from other apps)
    - **Firebase Services Enabled**: Authentication (email/password + Google), Firestore Database, Firebase Storage, Realtime Database, Analytics
    - **Security Rules Deployed**: Production-ready Firestore and Storage security rules with role-based access control
    - **Admin Account Created**: info@sinjapan.jp (UID: tBIDRMedxOZTHmEXiVhqgAWKGmH3) with admin, instructor privileges
    - **Object Storage**: Replit Object Storage bucket configured (sin-japan-school-media)
    - **Environment Variables**: All Firebase config variables set, Object Storage paths configured
    - **Database Schema**: Comprehensive Firestore schema designed for users, courses, lessons, enrollments, payments, reviews, messages, notifications, progress tracking

## External Dependencies
*   **Firebase (school-ec82e)**: Authentication, Firestore Database, Realtime Database, Storage, Analytics - **PRIMARY DATA STORE**
*   **Replit Object Storage**: Large-scale video/image storage (sin-japan-school-media bucket)
*   **Square**: Payment processing (replacing Stripe for Japanese market)
*   **React**: Frontend library
*   **Vite**: Frontend build tool
*   **Tailwind CSS**: Utility-first CSS framework
*   **Framer Motion**: Animation library
*   **i18next**: Internationalization framework
*   **Headless UI**: Unstyled, accessible UI components
*   **Express.js**: Backend web application framework
*   **Uppy**: File upload library

## Known Integrations
*   **Stripe Integration**: Configured but needs setup for payment processing
*   **Object Storage Integration**: Configured for course media uploads

## Development Notes
*   All major user-facing pages use consistent blue gradient design
*   Educational terminology is enforced throughout the codebase (UI/UX layer)
*   **Technical Structure**: Database and code use original field names (isCreator, creatorId) while UI displays educational terms
*   Firebase authentication and Firestore are primary data sources
*   Instructor dashboard provides comprehensive course analytics
*   Admin dashboard uses blue gradient (100% pink eliminated) for full consistency
*   All pages maintain professional educational branding
*   28 Admin pages fully converted to educational platform management system
*   Color conversion completed via automated batch processing for consistency
