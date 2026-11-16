import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { KeyInfoActorKind } from '../../../enums/primarySchoolKeyInfo.enum'
import { Allergy, LanguageEnvironment } from './lookups.model'

/** Audit stamp shared by the health and language profiles (contract §4.5/§4.6). */
@ObjectType('EducationPrimarySchoolUpdatedBy')
export class UpdatedBy {
  @Field(() => KeyInfoActorKind)
  kind!: KeyInfoActorKind

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

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date

  @Field(() => UpdatedBy, { nullable: true })
  updatedBy?: UpdatedBy
}

/** GET/PATCH /me/children/{childId}/language-profile (contract §4.6). */
@ObjectType('EducationPrimarySchoolLanguageProfile')
export class LanguageProfile {
  @Field(() => LanguageEnvironment, { nullable: true })
  languageEnvironment?: LanguageEnvironment

  /** Language code from the Ísland.is list (BCP 47, see getAllLanguageCodes) */
  @Field({ nullable: true })
  preferredLanguage?: string

  /** Language code from the Ísland.is list (BCP 47, see getAllLanguageCodes) */
  @Field(() => [String])
  languages!: string[]

  @Field()
  interpreter!: boolean

  @Field()
  signLanguage!: boolean

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date

  @Field(() => UpdatedBy, { nullable: true })
  updatedBy?: UpdatedBy
}
