# SIN JAPAN ONLINE SCHOOL

## Overview
SIN JAPAN ONLINE SCHOOL is a comprehensive online learning platform dedicated to providing quality education through professional instructors. The platform has been fully transformed from a social media/fan platform into a robust educational ecosystem. Its core purpose is to offer a complete learning management solution, featuring course catalogs, instructor dashboards, real-time student-instructor communication, and progress tracking. The platform's vision is encapsulated by its tagline: "あなたの未来を一緒に創る" (Creating your future together).

## User Preferences
I prefer iterative development with clear communication on changes. Please ask before making major architectural changes or introducing new dependencies. For UI/UX, maintain the consistent blue gradient design throughout all pages. Ensure all interactive elements have `data-testid` attributes for testing purposes.

## System Architecture
The platform is built with a React frontend, leveraging Vite for tooling, Tailwind CSS for styling, and Framer Motion for animations. Internationalization is handled by i18next. The backend uses Express.js for API services. Firebase (project `school-ec82e`) is the primary data and authentication backbone, providing Firestore Database for core application data, Realtime Database for messaging, and Firebase Storage for user-uploaded media. Replit Object Storage (Google Cloud Storage-based) is utilized for large course video files. Square payment integration manages all financial transactions.

**Key Features:**
*   **User Management**: Secure Firebase authentication, student and instructor profiles with KYC for instructors.
*   **Course System**: Course creation, enrollment, video lessons, progress tracking, ratings, and reviews.
*   **Communication**: Real-time student-instructor messaging with unread indicators via Firebase Realtime Database.
*   **Monetization**: Course pricing, Square payment processing, instructor earnings, and withdrawal system.
*   **Ranking**: Course rankings and student leaderboards.
*   **Dashboards**: Comprehensive Admin Dashboard for platform management and Instructor Dashboard for course analytics and earnings.
*   **Notifications**: Push and email notifications for updates.

**UI/UX Decisions:**
*   **Consistent Branding**: A uniform blue gradient (`from-blue-500 to-blue-700`) is applied across all pages, including user-facing pages, instructor, and admin dashboards.
*   **Educational Theme**: Uses educational icons (e.g., GraduationCap, BookOpen) and professional, educational aesthetics.
*   **Design Principles**: Simplified headers with gradient backgrounds, smooth Framer Motion animations, and responsive design. All interactive elements include `data-testid` attributes.

**Terminology Standardization (UI/UX Layer):**
*   **投稿** → **コース** (Courses)
*   **クリエイター** → **講師** (Instructors)
*   **ユーザー** → **学生** (Students)

**Technical Implementations:**
*   Dynamic data management from Firestore for courses and users.
*   Replit Object Storage with presigned URLs and ACL policies for media uploads.
*   Web Share API and `localStorage` for user-specific data.
*   Localized error messages (Japanese).
*   Firestore query optimizations for performance.

## External Dependencies
*   **Firebase (school-ec82e)**: Authentication, Firestore Database, Realtime Database, Storage, Analytics.
*   **Replit Object Storage**: For large media files (bucket: `sin-japan-school-media`).
*   **Square**: Payment processing.
*   **React**: Frontend library.
*   **Vite**: Frontend build tool.
*   **Tailwind CSS**: CSS framework.
*   **Framer Motion**: Animation library.
*   **i18next**: Internationalization framework.
*   **Headless UI**: Unstyled UI components.
*   **Express.js**: Backend framework.
*   **Uppy**: File upload library.