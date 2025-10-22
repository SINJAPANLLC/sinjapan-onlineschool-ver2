# SIN JAPAN ONLINE SCHOOL

## Overview
SIN JAPAN ONLINE SCHOOL is an online learning platform providing quality education through professional instructors. It offers comprehensive, accessible learning content with 24/7 support and a proven track record of student success. The platform aims to deliver a professional educational experience.

## User Preferences
I prefer iterative development with clear communication on changes. Please ask before making major architectural changes or introducing new dependencies. For UI/UX, maintain the consistent blue gradient design. Ensure all interactive elements have `data-testid` attributes for testing purposes.

## System Architecture
The platform features a React frontend built with Vite, Tailwind CSS, Framer Motion for animations, and i18next for internationalization. The backend utilizes Express.js with MongoDB (Mongoose) for data persistence. Firebase is central to user authentication, real-time messaging, and Firestore for data management. Replit Object Storage (Google Cloud Storage-based) handles large media uploads, including support for adult content and ACL-based access. Supabase is integrated for additional backend services.

**Key Features:**
*   **User Management**: Secure authentication, KYC/Identity verification for creators.
*   **Content & Community**: Image/video posting, likes, comments, subscriber-only content, real-time messaging.
*   **Monetization**: Subscriptions, payment processing via Stripe, creator monetization, normal and early payment options.
*   **Ranking System**: Creator and post rankings.
*   **Admin Dashboard**: Comprehensive management for users, content, revenue, reports, and analytics.
*   **Creator Dashboard**: Analytics, post performance, marketing tools.
*   **Notifications**: Push and email notifications.

**UI/UX Decisions:**
*   Consistent blue gradient design (`from-blue-500 to-blue-700`) across all interactive elements, banners, and buttons.
*   Simplified header designs and smooth animations (scale, hover, pulse).
*   Responsive design and `data-testid` attributes for all interactive elements.
*   Professional, educational look and feel.
*   Admin dashboard uses a consistent pink gradient design.

**Technical Implementations:**
*   Dynamic data display and management from Firestore.
*   Replit Object Storage for large-scale video/image uploads with presigned URLs, ACL policies, and adult content support.
*   Web Share API integration and `localStorage` for user-specific data.
*   Framer Motion for drag-and-drop and optimized swiping.
*   Real-time messaging via Firebase Realtime Database with unread indicators.
*   Comprehensive payment calculations (fees, taxes, business days).
*   Stripe SDK for secure payment processing using embedded Stripe Elements.
*   Firestore query optimizations (limiting, ordering, batching) for performance.
*   Localized error messages (Japanese) for user authentication and uploads.

## External Dependencies
*   **Firebase**: Authentication, Realtime Database, Firestore.
*   **Replit Object Storage**: Large-scale video/image storage (Google Cloud Storage-based).
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