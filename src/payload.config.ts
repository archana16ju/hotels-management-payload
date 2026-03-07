import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';


import Users from './collections/Users';
import Media from './collections/Media';
import Orders from './collections/Order';
import {Categories} from './collections/categories';
import CompanyProfile from './collections/CompanyProfile';
import {QrSettings} from './collections/QrSettings';
import  Tables from './collections/Tables';
import  Products from './collections/products';
import Payments from './collections/payments';
import Reviews from './collections/reviews';
import PaymentGateways from './collections/PaymentGateways';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is missing!');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing!');
}


export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
  user: 'users',
  importMap: {
    baseDir: path.resolve(dirname),
  },
  },
  collections: [
    Users,
    Media,
    Orders,
    Categories,
    CompanyProfile,
    QrSettings,
    Tables,
    Products,
    Payments,
    Reviews,
    PaymentGateways,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
  sharp,
  plugins: [],
});