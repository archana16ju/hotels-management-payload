import type { CollectionConfig } from 'payload'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  upload: false, 

  fields: [
    {
      name: 'image',
      type: 'text',
      admin: {
        description: 'Cloudinary Image URL',
      },
    },
    {
      name: 'alt',
      type: 'text',
    },
  ],
}