import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
  },

  upload: {
  staticDir: 'media',
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}