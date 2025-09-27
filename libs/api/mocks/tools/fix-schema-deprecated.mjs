import fs from 'fs'
import path from 'path'

const schemaPath = path.resolve('./apps/api/src/api.graphql')

// Fix any @deprecated reason with escapconstotes
const schema = fs.readFileSync(schemaPath, 'utf8').replace(/\\"/g, "'")

fs.writeFileSync(schemaPath, schema, 'utf8')
console.log('✅ Fixed deprecated reason strings in schema')
