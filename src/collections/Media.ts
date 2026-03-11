import type { CollectionConfig } from 'payload'
import { put } from '@vercel/blob'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: false,

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const file = req.file

        if (file) {
          const blob = await put(file.name, file.data, {
            access: 'public',
          })

          data.url = blob.url
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
    },
  ],
}