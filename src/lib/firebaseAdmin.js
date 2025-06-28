import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Load service account from file
const serviceAccountPath = path.join(process.cwd(), 'swiftsummarypro-firebase-adminsdk-fbsvc-a227444275.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({ credential: cert(serviceAccount) });
export const adminAuth = getAuth(); 