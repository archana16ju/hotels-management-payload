import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    mimeTypes: ['image/*'],
  },

  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        if (operation === 'create' && req.file) {

          const compressed = await sharp(req.file.data)
            .resize({ width: 1200 })
            .jpeg({ quality: 70 })
            .toBuffer()

          req.file.data = compressed
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}