import type { CollectionBeforeChangeHook } from 'payload'

export const generateBarcode: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  // Only run on creation
  if (operation !== 'create') return data

  console.log('GENERATE BARCODE HOOK RUNNING')

  // Skip if barcode already exists
  if (data.productBarcode) return data

  try {
    // Get company prefix
    const companyResult = await req.payload.find({
      collection: 'company-profile',
      limit: 1,
      req,
      overrideAccess: true,
    })
    const companyPrefix = (companyResult.docs[0] as any)?.companyPrefix || 'PRD'

    // Get latest product
    const latestProduct = await req.payload.find({
      collection: 'products',
      limit: 1,
      sort: '-createdAt',
      req,
      overrideAccess: true,
    })

    let nextNumber = 1
    if (latestProduct.docs.length > 0) {
      const lastBarcode = (latestProduct.docs[0] as any).productBarcode
      if (lastBarcode) {
        const match = lastBarcode.match(/\d+$/)
        if (match) nextNumber = parseInt(match[0], 10) + 1
      }
    }

    const productCode = String(nextNumber).padStart(5, '0')
    data.productBarcode = `${companyPrefix}${productCode}`

    return data
  } catch (error: any) {
    console.error('ERROR in generateBarcode hook:', error)
    throw error
  }
}