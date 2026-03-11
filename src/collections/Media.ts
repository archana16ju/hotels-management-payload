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
      required: false,
    },
  ],
}