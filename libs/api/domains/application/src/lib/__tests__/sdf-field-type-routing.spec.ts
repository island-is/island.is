import { FieldTypes } from '@island.is/application/types'
import { FIELD_TYPE_TO_GRAPHQL_TYPENAME } from '@island.is/application/sdf-types'

import { resolveComponentType } from '../sdf.model'

describe('SDF GraphQL component routing', () => {
  it('resolveComponentType matches FIELD_TYPE_TO_GRAPHQL_TYPENAME for each FieldTypes', () => {
    for (const ft of Object.values(FieldTypes)) {
      const expected = FIELD_TYPE_TO_GRAPHQL_TYPENAME[ft]
      const resolved = resolveComponentType({ type: ft })
      expect(resolved).toBe(expected)
    }
  })

  it('resolves CUSTOM with componentName to SdfCustomComponent', () => {
    expect(
      resolveComponentType({
        type: FieldTypes.CUSTOM,
        componentName: 'SomeWidget',
      }),
    ).toBe('SdfCustomComponent')
  })

  it('resolves repeater payload', () => {
    expect(
      resolveComponentType({
        type: 'REPEATER',
        arrayPath: 'employers',
      }),
    ).toBe('SdfRepeaterComponent')
  })
})
