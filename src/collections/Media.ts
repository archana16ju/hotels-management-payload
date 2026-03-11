import type { CollectionConfig } from 'payload'
import { put } from '@vercel/blob'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    disableLocalStorage: true, 
    mimeTypes: ['image/*'],
  },

  hooks: {
    beforeChange: [
      async ({ req, data }) => {
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
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}