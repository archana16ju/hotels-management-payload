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
    {
      name: 'folder',
      type: 'select',
      required: true,
      options: [
        { label: 'Products', value: 'products' },
        { label: 'Categories', value: 'categories' },
      ],
      admin: {
        description: 'Select where the image should be stored',
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (req.file && data?.folder) {
          req.file.name = `${data.folder}/${req.file.name}`
        }
        return data
      },
    ],
  },
}