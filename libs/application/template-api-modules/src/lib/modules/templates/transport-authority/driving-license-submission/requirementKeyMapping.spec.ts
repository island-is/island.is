import { RequirementKey as DomainRequirementKey } from '@island.is/api/domains/driving-license'
import { RequirementKey as SchemaRequirementKey } from '@island.is/application/templates/district-commissioners/driving-license'

// `toTypeEligibility` in driving-license-submission.service.ts reverse-maps a
// domain RequirementKey *value* (PascalCase) to its member *name* and relies on
// that name equalling a schema RequirementKey *value* (camelCase). The `?? r.key`
// fallback there is silent: a domain key with no matching schema value would
// surface to the applicant as the generic "contact sýslumaður" row instead of
// the real reason, with nothing logged. This test fails the day RLS adds or
// renames a key, forcing the schema enum to be kept in sync.
describe('RequirementKey domain↔schema alignment', () => {
  it('maps every domain member name to a schema RequirementKey value (and vice versa)', () => {
    const domainMemberNames = new Set(Object.keys(DomainRequirementKey))
    const schemaValues = new Set<string>(Object.values(SchemaRequirementKey))

    expect(schemaValues).toEqual(domainMemberNames)
  })
})
