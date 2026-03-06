'use client'

import React, { useState } from 'react'
import QRCode from 'qrcode'
import { useFormFields } from '@payloadcms/ui'

interface QRItem {
  name: string
  slug: string
  tableURL: string
  tableQR: string
}

const QRLazyGenerator = () => {
  const formFields = useFormFields(([fields]) => fields)

  const rawBaseurl = (formFields?.['qrConfig.baseurl']?.value as string) || ''
  const size = (formFields?.['qrConfig.size']?.value as number) || 300
  const tablecollections = formFields?.['tablecollections']?.value

  const [qrs, setQrs] = useState<QRItem[]>([])
  const [loading, setLoading] = useState(false)

  const generateQRCodes = async () => {
    if (!rawBaseurl) {
      alert('Missing Base URL. Please enter and SAVE.')
      return
    }

    if (!tablecollections) {
      alert('Please select Tables Collection and SAVE.')
      return
    }

    // Ensure baseurl ends with '/'
    const baseurl = rawBaseurl.trim().endsWith('/')
      ? rawBaseurl.trim()
      : rawBaseurl.trim() + '/'

    setLoading(true)

    try {
      const res = await fetch(`/api/tables/${tablecollections}`)
      if (!res.ok) throw new Error('Failed to fetch tables')

      const tableDoc = await res.json()
      const sections = tableDoc?.sections

      if (!sections?.length) {
        alert('No sections found')
        setLoading(false)
        return
      }

      const list: QRItem[] = []

      for (const section of sections) {
        const count = section.tableCount || section.tablecount
        if (!count) continue

        for (let i = 1; i <= count; i++) {
          const sectionName = section.sectionTitle || 'table'

          const slug =
            sectionName.toLowerCase().trim().replace(/\s+/g, '-') +
            `-table-${i}`

          // 🔹 ALWAYS point to table hub
          const tableURL = `${baseurl}${slug}`

          const tableQR = await QRCode.toDataURL(tableURL, {
            width: size,
            margin: 2,
          })

          list.push({
            name: `${section.sectionTitle} Table ${i}`,
            slug,
            tableURL,
            tableQR,
          })
        }
      }

      setQrs(list)
    } catch (error) {
      console.error(error)
      alert('Error generating QR codes')
    }

    setLoading(false)
  }

  const printQRCodes = () => {
    if (!qrs.length) {
      alert('Generate QR codes first')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Codes</title>
          <style>
            body { font-family: Arial; display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; }
            .qr-item { width: 200px; text-align: center; }
            img { width: 180px; height: 180px; }
          </style>
        </head>
        <body>
          ${qrs
            .map(
              (qr) => `
            <div class="qr-item">
              <img src="${qr.tableQR}" />
              <div>${qr.name}</div>
              <div style="font-size:12px;word-break:break-all;">${qr.tableURL}</div>
            </div>
          `
            )
            .join('')}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={generateQRCodes}
        disabled={loading}
        style={{
          padding: '10px 20px',
          marginRight: 10,
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Generate QR Codes'}
      </button>

      <button
        onClick={printQRCodes}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Print QR Codes
      </button>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          marginTop: 20,
        }}
      >
        {qrs.map((qr, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <img src={qr.tableQR} width={150} />
            <div>{qr.name}</div>
            <a href={qr.tableQR} download={`${qr.slug}.png`}>
              Download QR
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QRLazyGenerator