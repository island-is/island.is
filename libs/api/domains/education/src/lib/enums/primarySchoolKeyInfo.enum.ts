import { registerEnumType } from '@nestjs/graphql'

/**
 * Who registered or last changed a key-information record. Frigg uses two
 * overlapping enums for this — `unknown` only on creation, `system` only on
 * update — so both sets are modelled here as one.
 */
export enum KeyInfoActorKind {
  Guardian = 'guardian',
  Organization = 'organization',
  System = 'system',
  Unknown = 'unknown',
}

registerEnumType(KeyInfoActorKind, {
  name: 'EducationPrimarySchoolActorKind',
  description:
    'Who registered or last changed a key-information record. `unknown` means the record predates the audit trail.',
})

/** The two categories the key-option lists split allergies into. */
export enum AllergyCategory {
  Food = 'food',
  Other = 'other',
}

registerEnumType(AllergyCategory, {
  name: 'EducationPrimarySchoolAllergyCategory',
  description:
    'The categories MMS serves allergies in, one key-option list each.',
})
