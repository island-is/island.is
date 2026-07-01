import * as fs from 'fs'
import * as path from 'path'

import { FIELD_TYPE_TO_GRAPHQL_TYPENAME } from '@island.is/application/sdf-types'

/**
 * Ensures ComponentSwitch.tsx references every GraphQL component typename we
 * expect from the field-type contract (so new FieldTypes cannot ship without
 * UI). The renderer dispatch lives in ComponentSwitch: supported typenames
 * appear as `fieldRenderers` map keys (shorthand identifiers) and explicitly
 * unsupported ones as quoted strings in `unsupportedFieldTypes` — so each
 * typename must appear verbatim as a word, whether quoted or not.
 */
describe('FormRenderer field contract', () => {
  it('mentions every unique expected __typename from the contract', () => {
    const unique = new Set(Object.values(FIELD_TYPE_TO_GRAPHQL_TYPENAME))
    const componentSwitchPath = path.join(
      __dirname,
      '../../components/form-renderer/ComponentSwitch.tsx',
    )
    const src = fs.readFileSync(componentSwitchPath, 'utf8')

    for (const typename of unique) {
      expect(src).toMatch(new RegExp(`\\b${typename}\\b`))
    }
  })
})
