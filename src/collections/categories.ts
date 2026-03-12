import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Products',
    defaultColumns: ['name', 'slug', 'parent', 'image'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar', description: 'Auto-generated from name' },
hooks: {
  beforeValidate: [
    ({ data }) => {
      if (!data) return;

      if (data.name) {
        const slug = data.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')           
          .replace(/[^a-z0-9-._~]/g, ''); 
        data.slug = slug.length ? slug : 'category'; 
      }

      return data.slug;
    },
  ],
},
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media', 
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};