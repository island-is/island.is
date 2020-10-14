import fs from 'fs'

const schema = fs.readFileSync('apps/api/src/api.graphql').toString()
const escapedSchema = schema.replace(/[`$]/g, '\\$&').trim()

const wrappedSchema = `import gql from 'graphql-tag'
import { buildASTSchema } from 'graphql'

const schema = buildASTSchema(gql\`
${escapedSchema}
\`)

export default schema
`

fs.writeFileSync('libs/api/mocks/src/graphql/schema.ts', wrappedSchema)
