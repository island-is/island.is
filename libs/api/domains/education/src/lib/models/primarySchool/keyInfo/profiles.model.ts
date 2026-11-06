import { Field, ObjectType } from '@nestjs/graphql'
import { Allergy, LanguageEnvironment } from './lookups.model'

/** Audit stamp shared by the health and language profiles (contract §4.5/§4.6). */
@ObjectType('EducationPrimarySchoolUpdatedBy')
export class UpdatedBy {
  @Field()
  kind!: string

  @Field({ nullable: true })
  displayName?: string
}

/** GET/PATCH /me/children/{childId}/health-profile (contract §4.5). */
@ObjectType('EducationPrimarySchoolHealthProfile')
export class HealthProfile {
  @Field()
  epipen!: boolean

  @Field()
  medicalDiagnoses!: boolean

  @Field()
  medicationAssistance!: boolean

  @Field(() => [Allergy])
  allergies!: Allergy[]

  @Field({ nullable: true })
  updatedAt?: string

  @Field(() => UpdatedBy, { nullable: true })
  updatedBy?: UpdatedBy
}

/** GET/PATCH /me/children/{childId}/language-profile (contract §4.6). */
@ObjectType('EducationPrimarySchoolLanguageProfile')
export class LanguageProfile {
  @Field(() => LanguageEnvironment, { nullable: true })
  languageEnvironment?: LanguageEnvironment

  /** ISO 639-1 */
  @Field({ nullable: true })
  preferredLanguage?: string

  /** ISO 639-1 */
  @Field(() => [String])
  languages!: string[]

  @Field()
  interpreter!: boolean

  @Field()
  signLanguage!: boolean

  @Field({ nullable: true })
  updatedAt?: string

  @Field(() => UpdatedBy, { nullable: true })
  updatedBy?: UpdatedBy
}
