import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const res = await User.updateMany({}, { $unset: { isApproved: '' } });
    console.log('Update result:', res);

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
