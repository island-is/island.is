import { FIELD_TYPE_TO_GRAPHQL_TYPENAME } from '../sdfFieldTypesContract'

// The map's type already requires an entry for every `FieldTypes` value; this
// checks the naming convention the type can't.
describe('sdfFieldTypesContract', () => {
  it('names every GraphQL typename with the Sdf prefix', () => {
    const withoutPrefix = Object.entries(FIELD_TYPE_TO_GRAPHQL_TYPENAME).filter(
      ([, typename]) => !/^Sdf/.test(typename),
    )

    expect(withoutPrefix).toEqual([])
  })
})
