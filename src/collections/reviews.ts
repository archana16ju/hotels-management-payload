import { CollectionConfig } from 'payload';

const Reviews: CollectionConfig = {
  slug: 'reviews',
  fields: [
    {
      name: 'tableNumber',
      type: 'number',
      required: true,
    },
    {
      name: 'reviewMessage',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
    },
  ],
};

export default Reviews;