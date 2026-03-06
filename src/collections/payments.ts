import { CollectionConfig } from 'payload';

const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'paymentReference',
    group: 'Payments',
  },
  fields: [
    {
      name: 'tableId',
      type: 'text',
      required: true,
      index: true,
      label: 'Table ID',
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      label: 'Order',
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount',
    },
    {
      name: 'gateway',
      type: 'relationship',
      relationTo: 'payment-gateways',
      required: true,
      label: 'Payment Gateway',
    },
    {
      name: 'transactionId',
      type: 'text',
      label: 'Transaction ID',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'paymentReference',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.paymentReference) {
          const random = Math.floor(Math.random() * 9000) + 1000;
          const datePart = new Date()
            .toISOString()
            .split('T')[0]
            .replace(/-/g, '');
          data.paymentReference =
            `PAY-${datePart}-${random}`;
        }
        return data;
      },
    ],
  },
};

export default Payments;