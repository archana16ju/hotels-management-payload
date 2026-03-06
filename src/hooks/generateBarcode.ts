import type { CollectionBeforeChangeHook } from 'payload';

export const generateBarcode: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {

  if (operation !== 'create') {
    return data;
  }

  if (data.productBarcode) {
    return data;
  }

  const company = await req.payload.find({
    collection: 'company-profile',
    limit: 1,
  });

  if (!company.docs.length) {
    throw new Error('Company profile not found');
  }

  const companyPrefix = company.docs[0].companyPrefix || 'PRD';

  const productsCount = await req.payload.count({
    collection: 'products',
  });

  const nextNumber = productsCount.totalDocs + 1;

  const productCode = String(nextNumber).padStart(5, '0');

  data.productBarcode = `${companyPrefix}${productCode}`;

  return data;
};