import type { CollectionConfig } from 'payload';

const CompanyProfile: CollectionConfig = {
  slug: 'company-profile',

  labels: {
    singular: 'Company Profile',
    plural: 'Company Profile',
  },

  admin: {
    useAsTitle: 'companyName',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => false,
  },

  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
    },
        {
      name: 'companyPrefix',
      type: 'text',
      required: true,
      label: 'Company Prefix (GS1 / Custom)',
      admin: {
        description: 'Enter GS1 Company Prefix (4–7 digits). Example: 1234. Do not include country code (890).',
      },
    },
    {
      name: 'gstNumber',
      type: 'text',
      label: 'GST Number',
        admin: {
          description: 'Enter 15-character GSTIN (Goods and Services Tax Identification Number). Example: 29ABCDE1234F2Z5',
    },
    },
    {
      name: 'fssaiNumber',
      type: 'text',
      label: 'FSSAI License Number',
      admin: {
        description: '14-digit Food Safety License Number issued by FSSAI',
      },
    },
    {
      name: 'msmeNumber',
      type: 'text',
      label: 'MSME (Udyam) Registration Number',
      admin: {
        description: 'Udyam registration number issued for MSME businesses',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'state',
      type: 'text',
    },
    {
      name: 'country',
      type: 'text',
      defaultValue: 'India',
    },
    {
      name: 'pincode',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};

export default CompanyProfile;