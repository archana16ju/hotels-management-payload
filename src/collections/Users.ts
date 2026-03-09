import { CollectionConfig } from 'payload'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true, 
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',   
    },
  ],
}

export default Users