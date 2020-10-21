import fs from 'fs'

if (process.argv.length < 4) {
  throw new Error('Missing args. Usage: generate-gql <schema-in> <ts-out>')
}

const source = process.argv[2]
const target = process.argv[3]

const schema = fs.readFileSync(source).toString()
const escapedSchema = schema.replace(/[`$]/g, '\\$&').trim()

const wrappedSchema = `import gql from 'graphql-tag'
import { buildASTSchema } from 'graphql'

export const schema = buildASTSchema(gql\`
${escapedSchema}
\`)

export default schema
`

fs.writeFileSync(target, wrappedSchema)
