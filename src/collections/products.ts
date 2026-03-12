import type { CollectionConfig } from 'payload'
import { generateBarcode } from '../hooks/generateBarcode'

const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
    group: 'Products',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '30%',
          },
        },
        {
          name: 'foodType',
          type: 'radio',
          required: true,
          defaultValue: 'veg',
          options: [
            { label: 'Veg', value: 'veg' },
            { label: 'Non-Veg', value: 'non-veg' },
          ],
          admin: {
            layout: 'horizontal',
            width: '40%',
          },
        },
      ],
    },

    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'images',
      type: 'upload',
      relationTo: 'product-media',
      hasMany: true,
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'preparationTime',
      type: 'number',
      label: 'Preparation Time (minutes)',
      defaultValue: 10,
    },

    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
    },

    {
      name: 'variants',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'unit',
          type: 'select',
          required: true,
          options: [
            { label: 'Gram', value: 'g' },
            { label: 'Kilogram', value: 'kg' },
            { label: 'Piece', value: 'pcs' },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'rate',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'tax',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'netPrice',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'stockStatus',
          type: 'select',
          options: [
            { label: 'In Stock', value: 'in-stock' },
            { label: 'Low Stock', value: 'low-stock' },
            { label: 'Out of Stock', value: 'out-of-stock' },
          ],
        },
      ],
    },

    {
      name: 'defaultVariant',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Default variant index (0 = first variant)',
      },
    },

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'productBarcode',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    {
      name: 'hsnCode',
      type: 'text',
      label: 'HSN Code',
      admin: {
        position: 'sidebar',
      },
    },
  ],

  hooks: {
    beforeChange: [
      generateBarcode,

      ({ data }) => {
        if (data?.variants && Array.isArray(data.variants)) {
          data.variants = data.variants.map((variant: any) => {
            const rate = variant.rate || 0
            const quantity = variant.quantity || 0
            const discount = variant.discount || 0
            const tax = variant.tax || 0

            const price = rate * quantity
            const netPrice = price - discount + tax

            return {
              ...variant,
              price,
              netPrice,
            }
          })
        }

        return data
      },
    ],
  },

  timestamps: true,
}

export default Products