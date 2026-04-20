import * as fs from 'fs'
import * as path from 'path'

import { FIELD_TYPE_TO_GRAPHQL_TYPENAME } from '@island.is/application/sdf-types'

/**
 * Ensures FormRenderer.tsx references every GraphQL component typename we expect
 * from the field-type contract (so new FieldTypes cannot ship without UI).
 */
describe('FormRenderer field contract', () => {
  it('mentions every unique expected __typename from the contract', () => {
    const unique = new Set(Object.values(FIELD_TYPE_TO_GRAPHQL_TYPENAME))
    const formRendererPath = path.join(__dirname, '../../components/FormRenderer.tsx')
    const src = fs.readFileSync(formRendererPath, 'utf8')

    for (const typename of unique) {
      expect(src).toContain(`'${typename}'`)
    }
  })
})
