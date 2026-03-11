import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import Users from './collections/Users';
import { Media } from './collections/Media';
import Orders from './collections/Order';
import { Categories } from './collections/categories';
import CompanyProfile from './collections/CompanyProfile';
import { QrSettings } from './collections/QrSettings';
import Tables from './collections/Tables';
import Products from './collections/products';
import Payments from './collections/payments';
import Reviews from './collections/reviews';
import PaymentGateways from './collections/PaymentGateways';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Required environment variables
['PAYLOAD_SECRET','DATABASE_URL','BLOB_READ_WRITE_TOKEN'].forEach(key => {
  if (!process.env[key]) throw new Error(`${key} missing!`);
});

const serverURL: string =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  serverURL,

  cors: [serverURL].filter(Boolean),
  csrf: [serverURL].filter(Boolean),

  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
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

  secret: process.env.PAYLOAD_SECRET!,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),

  sharp,
});