import type { CollectionConfig } from 'payload'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const mediaDir = path.resolve(dirname, '../../public/media')

export const Media: CollectionConfig = {
  slug: 'media',

  upload: {
    staticDir: mediaDir,
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ],
  },

  admin: {
    useAsTitle: 'filename',
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'folder',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data

        const referer = (req.headers.get('referer') || '').toLowerCase()

        if (referer.includes('/products')) {
          data.folder = 'products'
        }

        if (referer.includes('/categories')) {
          data.folder = 'categories'
        }

        return data
      },
    ],

    beforeChange: [
      async ({ data, operation }) => {
        if (operation !== 'create') return data

        const folder = data.folder
        if (!folder) return data

        const filename = data.filename

        // Update filename so Payload looks inside folder
        data.filename = `${folder}/${filename}`

        // Update URLs
        data.url = `/media/${folder}/${filename}`
        data.thumbnailURL = `/media/${folder}/${filename}`

        // Update resized image paths
        if (data.sizes) {
          for (const sizeKey in data.sizes) {
            const size = data.sizes[sizeKey]
            if (size?.filename) {
              size.filename = `${folder}/${size.filename}`
              size.url = `/media/${folder}/${size.filename}`
            }
          }
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== 'create') return

        const folder = (doc as any).folder
        if (!folder) return

        const filename = (doc as any).filename.replace(`${folder}/`, '')
        const sizes = (doc as any).sizes || {}

        const targetDir = path.join(mediaDir, folder)

        try {
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true })
          }

          // Move main file
          const source = path.join(mediaDir, filename)
          const target = path.join(targetDir, filename)

          if (fs.existsSync(source)) {
            await fs.promises.rename(source, target)
          }

          // Move resized versions
          for (const sizeKey in sizes) {
            const size = sizes[sizeKey]

            if (size?.filename) {
              const cleanName = size.filename.replace(`${folder}/`, '')

              const sizeSource = path.join(mediaDir, cleanName)
              const sizeTarget = path.join(targetDir, cleanName)

              if (fs.existsSync(sizeSource)) {
                await fs.promises.rename(sizeSource, sizeTarget)
              }
            }
          }
        } catch (err) {
          console.error('Media move error:', err)
        }
      },
    ],
  },
}