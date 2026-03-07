import Payload from 'payload';

const apiURL = process.env.NEXT_PUBLIC_PAYLOAD_URL;

if (!apiURL) {
  throw new Error('NEXT_PUBLIC_PAYLOAD_URL is not defined');
}

export const payloadClient = Payload({
  apiURL,
  collections: ['categories', 'orders', 'reviews', 'payments'],
});