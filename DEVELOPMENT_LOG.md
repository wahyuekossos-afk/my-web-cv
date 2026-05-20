# Project Status: Interactive Professional CV & CMS
**Last Updated: 2026-05-20**

This document serves as a handover for any AI assistant or developer continuing this project.

## 🚀 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Icons**: Lucide-React
- **Backend**: Firebase (Firestore, Firebase Storage & Authentication)

## 📁 Key Project Structure
- `/src/app/page.js`: Main landing page (consumes dynamic data).
- `/src/app/admin/dashboard/page.js`: The heart of the CMS. Manages all sections.
- `/src/lib/firebase.js`: Firebase initialization logic.
- `/src/lib/db.js`: Database operations (get/update content, portfolio, messages).
- `/src/lib/auth.js`: Authentication logic (login/logout).
- `/src/lib/storage.js`: Firebase Storage upload helpers.
- `/src/components/`: Reusable UI components (Hero, About, Skills, Experience, Portfolio, Contact).

## 🔧 Firebase Configuration
The project is connected to Firebase project: `cv-wahyu`.
- **Authentication**: Email/Password enabled (Admin login).
- **Firestore**:
  - `content` collection: `main` document holds `personalInfo`, `skills`, `experience`, `skillsTitle`.
  - `portfolio` collection: Individual documents for each project.
  - `messages` collection: Contact form submissions.
- **Storage**: Used for profile pictures and portfolio project images.

## ✅ Completed Features
1.  **Fully Dynamic Landing Page**: All text, skills, experiences, and projects come from Firestore.
2.  **CMS Dashboard**:
    - **Overview**: Stats and message counts.
    - **CV Content**: Edit name, title, about, profile pic.
    - **Skills**: Dedicated Category Manager (add/delete containers) and skill items with level bars.
    - **Experience**: Timeline manager with auto-sorting by year.
    - **Contact Info**: Edit contact details, footer social links, and section text.
    - **Portfolio Manager**: Add/Update/Remove projects. Supports editing details of existing items in place!
    - **Inbox**: View and delete messages from the contact form.
3.  **Firebase & Storage Integration**:
    - **Direct File Uploads**: Profile picture and Project images can be uploaded directly to Firebase Storage.
    - **Smart Paste to Upload**: Copy any image to clipboard and paste (`Ctrl+V`) inside the CMS dashboard to automatically upload it!
    - Automatic fallback to `localStorage` (Demo Mode) if Firebase is not configured.
4.  **A4 PDF Download Feature**:
    - Integrated clean print-friendly PDF generation for A4 sized print matching web CV aesthetics without breaking sections.

## 🛠 Maintenance & Next Steps
- **Security**: Current Firestore rules are open for development (`allow read, write: if true`). These should be restricted to `allow read: if true; allow write: if request.auth != null;` before official launch.
- **Deployment**: Deployed on **Vercel**. Ensure all `NEXT_PUBLIC_FIREBASE_*` variables from Vercel dashboard matches `.env.local` to disable Demo Mode.

## 💡 Notes for Next Agent
- The `Experience` component uses `year || period` and `title || role` to maintain compatibility between CMS inputs and legacy data.
- The `Skills` section uses a `skillsTitle` field in the database for the "Core Expertise" heading.
- Portfolio items have full **Edit/Update** functionality implemented; clicking "Edit" will populate the creation form, scroll the user smoothly to the top, and allow modification/saving directly.

---
*Created by Antigravity AI*
