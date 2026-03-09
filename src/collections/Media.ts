import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
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