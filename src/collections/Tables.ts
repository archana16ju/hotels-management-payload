import type { CollectionConfig } from 'payload'

export const Tables: CollectionConfig = {
  slug: 'tables',

  admin: {
    useAsTitle: 'displayName',
  },

  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Title',
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'sections',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'tableCount',
          type: 'number',
          required: true,
        },
      ],
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.displayName) {
          data.slug = data.displayName
            .toLowerCase()
            .replace(/ /g, '-')      
            .replace(/[^\w-]+/g, '') 
        }
        

        return data
      },
    ],
  },
}

export default Tables;