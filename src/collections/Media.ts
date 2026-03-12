import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
  },

  admin: {
    useAsTitle: 'alt',
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req }) => {
        if (!req.file) return

        const referer = req.headers.get('referer') || ''

        let folder = 'media'

        if (referer.includes('products')) {
          folder = 'products'
        }

        if (referer.includes('categories')) {
          folder = 'categories'
        }

        req.file.name = `${folder}/${req.file.name}`
      },
    ],
  },
}