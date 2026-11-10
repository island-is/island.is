import { Field, ID, ObjectType } from '@nestjs/graphql'

/** Relation-type lookup option, from `GET /key-options?type=relation`
 * (contract §4.1). */
@ObjectType('EducationPrimarySchoolRelationType')
export class RelationType {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  relation?: string

  @Field()
  title!: string
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

  @Field()
  title!: string
}

/** Language-environment lookup option, from
 * `GET /key-options?type=languageEnvironment` (contract §4.1). */
@ObjectType('EducationPrimarySchoolLanguageEnvironment')
export class LanguageEnvironment {
  @Field(() => ID)
  id!: string

  @Field()
  code!: string

  @Field()
  title!: string
}
