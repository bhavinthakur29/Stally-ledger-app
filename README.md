# 🏦 TekTally
**The Award-Winning Personal & Team Ledger by TekSquad.**

TekTally is a premium, high-security finance tracking application built with React Native and Expo. It combines sophisticated glassmorphism aesthetics with enterprise-grade security features and fintech-precision typography.

---

## ✨ Key Features

### 💎 Elite UI/UX
* **Glassmorphic Architecture:** Advanced frosted-glass effect using `expo-blur` and custom mesh gradients that shift beautifully behind UI elements.
* **System Theme Integration:** Native light and dark mode support that follows system defaults to ensure a flicker-free, stable experience.
* **Fintech Typography:** Monospaced (tabular) numeric font for currency displays to ensure vertical alignment and visual stability during balance updates.
* **Dynamic Greetings:** Time-aware greetings (Morning/Afternoon/Evening) featuring celestial emoji avatars (🌅, ☀️, 🌇, 🌙) that update based on your local time.

### 🛡️ Enterprise Security
* **Biometric Vault:** Secure biometric authentication (Fingerprint/FaceID/PIN) with a **1-minute grace period** to allow quick app switching without constant re-locking.
* **Soft Delete Safety Net:** Account deletion requests include a **3-day safety window**, allowing users to cancel and recover data if requested by mistake.
* **Logout Confirmation:** Native alert dialogs to prevent accidental session termination.

### 🚀 Performance & Infrastructure
* **Optimized Media:** Automatic local image compression (via `expo-image-manipulator`) that shrinks 10MB+ receipt photos down to optimized JPEGs before cloud upload.
* **Smart Loading States:** Context-aware loading modals that keep users informed (e.g., "Processing Image...", "Syncing with Cloud...").
* **Cloud Architecture:** Real-time data persistence via Firebase Firestore and Auth, with push notifications handled by Expo Push API (FCM V1).

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Expo](https://expo.dev/) (React Native) |
| **Runtime** | [Bun](https://bun.sh/) |
| **Database/Auth** | [Firebase](https://firebase.google.com/) (Firestore & Auth) |
| **Styling** | NativeWind (Tailwind CSS) & `expo-blur` |
| **Animations** | [Moti](https://moti.fyi/) & [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| **Media Handling** | `expo-image-manipulator` & `expo-image-picker` |
| **Haptics** | `expo-haptics` (Tactile feedback) |

---

## ⚙️ Getting Started

### Prerequisites
* [Bun](https://bun.sh/) installed on your machine.
* Expo Go app on your phone or an Android Emulator.
* Firebase project with `google-services.json` in the root directory.

### Installation
1. **Clone and Install:**
   ```bash
   bun install
   ```

2. **Run development server**

   ```bash
   bun x expo start
   ```

3. **Launch on Android**

   ```bash
   bun run android
   ```

---

## 📦 Production hardening

- **Babel console stripping:** Automatically removes all `console.log` statements in production to maximize performance.
- **Proguard/R8:** Optimized native code shrinking for Android.
- **EAS Build:** Managed build pipeline for consistent `.apk` and `.aab` generation.

Android release builds also benefit from **R8 / Proguard** as enabled in the standard Expo prebuild pipeline for production.

---

## ⚖️ Legal and privacy

TekTally is built with privacy-first defaults: biometric templates stay on the device; ledger data lives in your Firebase project under your rules. Full **Privacy Policy** and **Terms of Service** are available in the app under **Settings**.

---

Developed with ❤️ by **TekSquad**.
