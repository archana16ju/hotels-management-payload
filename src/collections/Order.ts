import { CollectionConfig } from 'payload';

const Orders: CollectionConfig = {
  slug: 'orders',

  admin: {
    useAsTitle: 'invoiceNumber'
  },

  fields: [
    {
      name: 'products',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'priceAtOrder',
          type: 'number',
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          admin: { readOnly: true },
        }, 
        {
          name: 'kitchenStatus',
          type: 'select',
          options: [
            { label: 'Ordered', value: 'ordered' },
            { label: 'Prepared', value: 'prepared' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
          defaultValue: 'ordered',
        },
      ],
    },
    {
      name: 'kotNumber',
      type: 'number',
      required: true,
    },
    {
      name: 'tableNumber',
      type: 'number',
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      admin: { 
        readOnly: true,
        position: 'sidebar'
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: { 
        readOnly: true,
        position: 'sidebar'
      },
    },
    {
      name: 'billingStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }, 
      ],
      defaultValue: 'pending',
      admin: { 
        position: 'sidebar',
      }
    }
  ],

  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {

        if (operation === 'create' && !data.invoiceNumber) {
          const random = Math.floor(Math.random() * 9000) + 1000;
          const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
          data.invoiceNumber = `INV-${datePart}-${random}`;
        }

        let total = 0;
        if (data.products && Array.isArray(data.products)) {
          for (const item of data.products) {
            if ((!item.priceAtOrder || item.priceAtOrder === 0) && item.product) {
              try {
                const productDoc = await req.payload.findByID({
                  collection: 'products',
                  id: item.product,
                });
                item.priceAtOrder = (productDoc as any)?.price || 0;
              } catch (error) {
                console.error('Error fetching product:', error);
                item.priceAtOrder = 0;
              }
            }
            item.subtotal = (item.priceAtOrder || 0) * (item.quantity || 1);
            total += item.subtotal;
          }
        }
        data.totalAmount = total;

        console.log('DEBUG:', { billingStatus: data.billingStatus });
        
        if (data.billingStatus === 'cancelled') {
    
          const hasPreparedOrDeliveredItems = data.products?.some((item: any) => 
            item.kitchenStatus === 'prepared' || item.kitchenStatus === 'delivered'
          );
          
          console.log('Products kitchen statuses:', data.products?.map((p: any) => p.kitchenStatus));
          
          if (hasPreparedOrDeliveredItems) {
            console.log('CANCEL BLOCKED!');
            throw new Error('Cannot cancel - some kitchen items are Prepared or Delivered!');
          }
        }
        console.log(' CANCEL ALLOWED');

        return data;
      },
    ],
  },
};

export default Orders;
