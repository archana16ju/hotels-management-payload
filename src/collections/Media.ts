import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, 
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
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};