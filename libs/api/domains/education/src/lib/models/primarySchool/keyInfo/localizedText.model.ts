import { Field, ObjectType } from '@nestjs/graphql'

/**
 * A value localised to the UI languages MMS supports (contract §4). The
 * frontend picks the field for the active locale — the server stays
 * locale-agnostic, matching the Frigg key-option pattern.
 */
@ObjectType('EducationPrimarySchoolLocalizedText')
export class LocalizedText {
  @Field()
  is!: string

  @Field()
  en!: string
}
