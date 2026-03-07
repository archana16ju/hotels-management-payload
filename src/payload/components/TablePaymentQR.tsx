'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

type TablePaymentQRProps = {
  tableSlug: string
}

const TablePaymentQR: React.FC<TablePaymentQRProps> = ({ tableSlug }) => {
  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateTableQR = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_FRONTEND_URL ||
          'http://localhost:3000' 
        const tableUrl = `${baseUrl}/table/${tableSlug}`

        const qrImage = await QRCode.toDataURL(tableUrl)

        setQr(qrImage)
      } catch (err) {
        console.error('Failed to generate QR:', err)
      }
      setLoading(false)
    }

    generateTableQR()
  }, [tableSlug])

  if (loading) return <div className="text-center p-4">Generating QR...</div>
  if (!qr) return <div className="text-center p-4 text-red-500">Failed to generate QR</div>

  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-orange-600">Scan to Order</h3>
      <img src={qr} width={250} height={250} alt={`QR for table ${tableSlug}`} />
      <p className="mt-2 text-gray-600 font-medium">Table: {tableSlug}</p>
    </div>
  )
}

export default TablePaymentQR