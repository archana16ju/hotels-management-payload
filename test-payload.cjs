
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const { getPayload } = require('payload')
const config = require('./src/payload.config').default

async function test() {
  try {
    console.log('Initializing payload...')
    const payload = await getPayload({ config })
    
    console.log('Testing company-profile find...')
    const company = await payload.find({
      collection: 'company-profile',
      limit: 1,
    })
    console.log('Company Profile docs:', company.docs.length)

    console.log('Testing products count...')
    const count = await payload.count({
      collection: 'products',
    })
    console.log('Products count result type:', typeof count)
    console.log('Products count result:', JSON.stringify(count))
    
    process.exit(0)
  } catch (err) {
    console.error('DIAGNOSTIC FAILED:', err)
    process.exit(1)
  }
}

test()
