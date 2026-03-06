'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const TablePaymentQR = ({ tableSlug }: { tableSlug: string }) => {

  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const generatePaymentQR = async () => {

      try {
        const res = await fetch(
          `/api/payments?where[tableNumber][equals]=${tableSlug}&limit=1&sort=-createdAt`
        )

        const data = await res.json()

        const payment = data?.docs?.[0]

        if (!payment) {
          setLoading(false)
          return
        }

        const paymentURL =
          `upi://pay?pa=hotel@upi` +
          `&pn=HotelName` +
          `&am=${payment.amount}` +
          `&tn=${payment.tableNumber}`

        const qrImage = await QRCode.toDataURL(paymentURL)

        setQr(qrImage)

      } catch (err) {

        console.error(err)

      }

      setLoading(false)
    }

    generatePaymentQR()

  }, [tableSlug])

  if (loading) return <div>Loading payment QR...</div>

  if (!qr) return <div>No payment found</div>

  return (
    <div>
      <h3>Scan to Pay</h3>
      <img src={qr} width={250} />
    </div>
  )
}

export default TablePaymentQR