# Firebase Setup Guide

To get your CV website fully functional with the CMS, follow these steps:

## 1. Create a Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/).
- Click **Add Project** and follow the steps.

## 2. Enable Authentication
- In the sidebar, click **Authentication**.
- Click **Get Started**.
- Enable **Email/Password** sign-in provider.
- **IMPORTANT**: Go to the **Users** tab and click **Add User**. This will be your admin account for the CMS.

## 3. Enable Firestore Database
- Click **Firestore Database** in the sidebar.
- Click **Create Database**.
- Choose a location and start in **Test Mode** (you should update rules later for production).
- The code will automatically create the `content` and `portfolio` collections when you first save from the dashboard.

## 4. Enable Firebase Storage
- Click **Storage** in the sidebar.
- Click **Get Started**.
- Follow the prompts to set up your storage bucket.

## 5. Get API Keys
- Click the gear icon (Project Settings).
- Under **Your apps**, click the `</>` icon to add a Web App.
- Copy the `firebaseConfig` values.

## 6. Configure Environment Variables
Create a `.env.local` file in the root of this project and add your keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 7. Firestore Collections Structure
The code uses the following structure:
- `content/main`: Document containing personal info, skills, and experience.
- `portfolio/`: Collection of project documents.
- `messages/`: Collection of visitor messages.
