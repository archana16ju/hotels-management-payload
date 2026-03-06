import type { CollectionConfig } from 'payload'

export const QrSettings: CollectionConfig = {
  slug: 'qr-settings',

  timestamps: true,

  admin: {
    group: 'Settings',
    useAsTitle: 'name',
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
      label: 'Name',
    },
    {
      name: 'tablecollections',
      type: 'relationship',
      relationTo: 'tables',
      required: true,
      label: 'Table',
    },
    
    {
      name: 'qrOptions',
      type: 'group',
      label: 'QR Options',
      fields: [
        {
          name: 'enableOrder',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Order',
        },
        {
          name: 'enablePayment',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Payment',
        },
        {
          name: 'enableReview',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Review',
        },
      ],
    },
    {
      name: 'qrConfig',
      type: 'group',
      label: 'QR Configuration',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable QR',
        },
        {
          name: 'baseurl',
          type: 'text',
          required: true,
          label: 'Base URL',
          admin: {
            description: 'Example: https://yourdomain.com/table',
          },
        },
        {
          name: 'size',
          type: 'number',
          defaultValue: 300,
          min: 100,
          max: 600,
          label: 'QR Size',
        },
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
          label: 'QR Logo',
        },
      ],
    },
    {
      name: 'qrGenerator',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/payload/components/QRLazyGenerator',
        },
      },
    },
    {
      name: 'printconfig',
      type: 'group',
      label: 'Print Settings',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'printsize',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
        {
          name: 'includeTableNumber',
          type: 'checkbox',
          defaultValue: true,
          label: 'Include Table Number',
        },
        {
          name: 'printTemplate',
          type: 'textarea',
          label: 'Print Template',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Generating',
          value: 'generating',
        },
        {
          label: 'Ready To Print',
          value: 'ready',
        },
      ],
    },

  ],
}