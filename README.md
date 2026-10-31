# School Smart Print System

Students and teachers scan a QR code, open the print portal on their phone, upload a file (PDF, Word, Excel, PowerPoint, text or image), choose their print options, and submit. By default the request is sent straight to the printer. Administrators can switch on approval in Settings, and can then review, approve, reject, cancel or retry requests. The web app never talks to the printer. A small Python program called the print agent, running on the computer connected to the printer, collects approved requests and prints them. See `print-agent/README.md`.

## 1. Create the Firebase project

1. Go to the Firebase console and create a project.
2. **Authentication**: open *Build > Authentication > Get started* and enable the **Email/Password** provider. Leave email confirmation off.
3. **Realtime Database**: open *Build > Realtime Database > Create database* and choose a location. Copy the database URL shown at the top (it looks like `https://your-project-default-rtdb.firebaseio.com`).
4. **Storage (optional)**: enable this only if you need to keep printing jobs uploaded before moving to Cloudinary.
5. **Web app**: in *Project settings > General > Your apps*, add a web app and copy the configuration values.

## 2. Create and configure Cloudinary

Create a Cloudinary account and an **unsigned upload preset**. Limit the preset to the file types supported by the print form and a maximum file size of 50 MB; disable overwriting existing assets if that option is available. Uploads use the `raw` resource type.

**Unsigned Cloudinary uploads are public:** anyone who obtains a file URL can download that document. The app stores the URL in the Firebase job record, which is readable by anyone who knows the job ID.

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the Firebase web app settings and Cloudinary cloud name and unsigned preset name:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

These are public configuration values; never place a Cloudinary API secret, Firebase service account key, or Admin SDK credential in the web app.

If any variable is missing, the app shows a "print system not connected" screen instead of loading.

## 4. Apply the Firebase database rules

Install the Firebase CLI once on your computer (`npm install -g firebase-tools`), then from the project folder:

```
firebase login
firebase use --add        # select your Firebase project
firebase deploy --only database
```

- `database.rules.json` controls the Realtime Database. Anyone can create a print request with valid fields. Anyone can read a single request by its ID (needed for the status page). Only administrators can list all requests, change requests, and change settings.
- `storage.rules` applies only to any pre-existing files in Firebase Storage. New files are uploaded to Cloudinary.

## 5. Automatically delete old print requests

The scheduled Firebase Function deletes each print file and its Realtime Database record once the request is at least 10 days old. It runs hourly, so deletion happens within about an hour after the 10-day mark. Legacy files stored in Firebase Storage are also deleted. The function only removes files whose stored path matches that request's expected file path.

Scheduled functions require the Firebase project to use the **Blaze** (pay-as-you-go) plan, and Cloud Scheduler may incur charges. Set the Cloudinary credentials as Firebase secrets; do not add them to the web app's `.env`:

```
firebase functions:secrets:set CLOUDINARY_CLOUD_NAME
firebase functions:secrets:set CLOUDINARY_API_KEY
firebase functions:secrets:set CLOUDINARY_API_SECRET
```

From the project folder, build and deploy the function:

```
npm --prefix functions install
npm --prefix functions run build
firebase deploy --only functions,database
```

The database deployment adds the `createdAt` index used by cleanup. If a file cannot be deleted, its Firebase record is retained and the function logs the error; a later run will retry it.

## 6. Create the first administrator

1. In *Authentication > Users*, click **Add user**, enter the administrator's email and a strong password.
2. Copy the new user's **User UID**.
3. In *Realtime Database > Data*, add this record (replace `PASTE_UID_HERE`):

```
adminUsers
  PASTE_UID_HERE
    email: "admin@yourschool.edu"
    role: "admin"
```

The admin dashboard checks `adminUsers/{uid}/role == "admin"`. Users without this record can sign in but see an "access not available" message.

4. **Legacy Firebase Storage downloads (optional).** If you need administrators to download old files from Firebase Storage, set the `admin` custom claim on the token. Run this once, locally, with a service account key downloaded from *Project settings > Service accounts* (keep the key out of the repository and delete it afterwards):

```
npm install firebase-admin
node -e "require('firebase-admin').initializeApp({credential: require('firebase-admin').credential.cert(require('./service-account.json'))}); require('firebase-admin').auth().setCustomUserClaims('PASTE_UID_HERE', {admin: true}).then(() => console.log('done'))"
```

The administrator must sign out and sign in again for the claim to apply.

5. Set the school name, upload limits and defaults in *Settings*. The first save creates the `settings` record. Until then, sensible defaults are used.

## 7. Run locally

```
npm install
npm run dev
```

Open the address printed in the terminal. Admin sign-in is at `/admin/login`.

## 8. Build

```
npm run build
```

The production files are written to `dist/`.

## 9. Deploy

### Option A: Firebase Hosting (same project as the database)

```
npm run build
firebase deploy --only hosting
```

`firebase.json` already rewrites all routes to `index.html`, so `/print`, `/status/...` and `/admin` work on refresh.

### Option B: Netlify or Vercel

Build command: `npm run build`. Publish directory: `dist`. Add all `VITE_FIREBASE_*` and `VITE_CLOUDINARY_*` variables in the site settings. Add a single-page-app rewrite rule that sends all paths to `/index.html`.

After deploying, add your site's domain under *Authentication > Settings > Authorized domains* in Firebase.

## 10. QR code

Sign in as an administrator, open **Settings**, and click **Download QR Code**. The code points to `https://your-domain/print` using the domain you are currently viewing, so it updates automatically after deployment. The PNG is 1200 px wide, suitable for printing at A4 or A5 and placing next to the printer.

## 11. Using the system

**Students and teachers**: scan the QR code, upload a file, choose copies, pages (for example `1-5`, `2,4,6` or `1-3,7,9`), colour mode and sides, then submit. No personal details are required. Word, Excel and PowerPoint files are converted to PDF by the print agent before printing, so the printer computer needs LibreOffice installed. Keep the job ID from the confirmation page to check the status later at `/status/PR-...`.

**Administrators**: open the dashboard or **Print Jobs**. Use the status pills, search, date range and sort to find requests. Use the icon buttons in each row or the **View** button to open a job, download its PDF, and approve, reject, cancel or retry it.

## 12. Print agent (printer computer)

The print agent lives in `print-agent/` and runs on the computer that is connected to the printer. It is not part of the web app. Setup, configuration and running it are described in `print-agent/README.md`.

In short, it:

1. Looks for jobs with `status == "APPROVED"`.
2. Claims a job by changing its status to `"SAVING"` or `"PRINTING"` (so two agents never process the same job).
3. Downloads new files from Cloudinary (or old files from Firebase Storage) and converts non-PDF files to PDF.
4. Saves documents as PDFs in `save_pdf` mode, or sends them to the printer in `print` mode.
5. Sets the job status to `"SAVED"` or `"PRINTED"` on success, or `"FAILED"` with `errorMessage` on failure. Admins can retry failed jobs from the admin console.

The agent uses a Firebase service account key stored only on the printer computer. Never put that key in the web app or in the repository.

## Project layout

```
src/
  admin/       admin-only screens, filters, actions and route guard
  components/  reusable UI pieces (buttons, cards, modal, print form parts)
  firebase/    Firebase client setup
  hooks/       live data hooks (jobs, settings, admin sign-in state)
  layouts/     public and admin page frames
  pages/       one component per route
  services/    all reads and writes to Firebase
functions/     scheduled server-side cleanup for expired print requests
print-agent/   Python program that saves PDFs or prints approved jobs
  types/       shared data types
  utils/       validation, formatting, status labels
```

## Known limits

- Students do not sign in, so anyone with the link can submit a request. Each request is validated by the database rules, and a request can only be created once with a given job ID.
- The job ID check in the app is not atomic. Two identical IDs at the same instant are very unlikely (the ID includes a random 4-digit number) but not impossible.
