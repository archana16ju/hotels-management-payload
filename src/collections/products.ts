import type { CollectionConfig } from 'payload'
import { generateBarcode } from '../hooks/generateBarcode'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Products',
  },
  fields: [
    // Active + Food Type in same row
    {
      type: 'row',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '30%' },
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
          admin: { layout: 'horizontal', width: '70%' },
        },
      ],
    },

    // Product Name
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    // Images
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      admin: {
        description: 'Upload product images only',
        disableListColumn: true,
      },
    },

    // Description
    {
      name: 'description',
      type: 'textarea',
    },

    // Preparation Time
    {
      name: 'preparationTime',
      type: 'number',
      label: 'Preparation Time (minutes)',
      defaultValue: 10,
    },

    // Featured Product
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      defaultValue: false,
    },

    // Variants
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
        { name: 'quantity', type: 'number', required: true },
        { name: 'rate', type: 'number', required: true },
        { name: 'price', type: 'number', admin: { readOnly: true } },
        { name: 'discount', type: 'number', defaultValue: 0 },
        { name: 'tax', type: 'number', defaultValue: 0 },
        { name: 'netPrice', type: 'number', admin: { readOnly: true } },
        { name: 'stock', type: 'number', defaultValue: 0 },
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

    // Sidebar Fields
    {
      name: 'defaultVariant',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Default variant index (0 = first variant)' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'productBarcode',
      type: 'text',
      unique: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'hsnCode',
      type: 'text',
      admin: { position: 'sidebar' },
    },
  ],

  hooks: {
    beforeChange: [
      generateBarcode, // Auto barcode generation

      // Variant price calculation
      ({ data }) => {
        if (Array.isArray(data.variants)) {
          data.variants = data.variants.map((variant: any) => {
            const rate = variant.rate || 0
            const quantity = variant.quantity || 0
            const discount = variant.discount || 0
            const tax = variant.tax || 0
            const price = rate * quantity
            const netPrice = price - discount + tax
            return { ...variant, price, netPrice }
          })
        }
        return data
      },
    ],
  },

  timestamps: true,
}

export default Products