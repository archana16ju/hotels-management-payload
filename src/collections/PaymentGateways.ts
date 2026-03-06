import { CollectionConfig } from 'payload';

const PaymentGateways: CollectionConfig = {
  slug: 'payment-gateways',
  admin: {
    useAsTitle: 'name',
    group: 'Payments',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Gateway Name',
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Paytm', value: 'paytm' },
        { label: 'PhonePe', value: 'phonepe' },
      ],
    },
    {
      name: 'keyId',
      type: 'text',
      required: true,
    },
    {
      name: 'keySecret',
      type: 'text',
      required: true,
      admin: {
        description: 'Keep secret secure',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};

export default PaymentGateways;