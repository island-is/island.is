import { FieldTypes } from '@island.is/application/types'

import {
  ALL_SDF_FIELD_TYPES,
  FIELD_TYPE_TO_GRAPHQL_TYPENAME,
} from '../sdfFieldTypesContract'

describe('sdfFieldTypesContract', () => {
  it('includes every FieldTypes enum member exactly once', () => {
    const fromEnum = new Set(Object.values(FieldTypes))
    const fromAll = new Set(ALL_SDF_FIELD_TYPES)
    expect(fromAll.size).toBe(fromEnum.size)
    for (const v of fromEnum) {
      expect(fromAll.has(v)).toBe(true)
    }
  })

  it('maps every FieldTypes to a GraphQL __typename', () => {
    for (const ft of Object.values(FieldTypes)) {
      expect(FIELD_TYPE_TO_GRAPHQL_TYPENAME[ft]).toMatch(/^Sdf/)
    }
  })

  it('has a contract key for each FieldTypes value', () => {
    for (const ft of Object.values(FieldTypes)) {
      expect(FIELD_TYPE_TO_GRAPHQL_TYPENAME[ft]).toBeDefined()
    }
  })
})
