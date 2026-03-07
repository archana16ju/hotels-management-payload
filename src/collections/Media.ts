import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,       
    create: ({ req }) => !!req.user,   
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,   
  },
}

export default Media
