import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
  },

  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'category', 'updatedAt'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Image Alt Text',
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      label: 'Image Category',
    },

    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      label: 'Image Tags',
    },
  ],
}