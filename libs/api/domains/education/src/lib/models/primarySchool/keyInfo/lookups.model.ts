import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LocalizedText } from './localizedText.model'

/** GET /agent-relation-types (contract §4.1). */
@ObjectType('EducationPrimarySchoolRelationType')
export class RelationType {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  relation?: string

  @Field(() => LocalizedText)
  title!: LocalizedText
}

/** Allergy lookup option, from `GET /key-options`. `type` splits the list into
 * food / other. `code` is not unique across types, so key off `id`. */
@ObjectType('EducationPrimarySchoolAllergy')
export class Allergy {
  @Field(() => ID)
  id!: string

  @Field()
  code!: string

  @Field()
  type!: string

  @Field(() => LocalizedText)
  title!: LocalizedText
}

/** GET /language-environments (contract §4.1). */
@ObjectType('EducationPrimarySchoolLanguageEnvironment')
export class LanguageEnvironment {
  @Field(() => ID)
  id!: string

  @Field()
  code!: string

  @Field(() => LocalizedText)
  title!: LocalizedText
}
