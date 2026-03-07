import type { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  admin: {
    useAsTitle: 'name',
  },

  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp' , 'image/avif'],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
}

export default Media