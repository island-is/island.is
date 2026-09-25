import { Field, ID, InputType } from '@nestjs/graphql'

/** POST /me/children/{childId}/agents — name is resolved from Þjóðskrá by MMS. */
@InputType('EducationPrimarySchoolAddAgentInput')
export class AddAgentInput {
  @Field(() => ID)
  childId!: string

  @Field()
  nationalId!: string

  @Field(() => ID)
  relationTypeId!: string
}

/** PATCH /me/children/{childId}/agents/{agentId} — only the relation type. */
@InputType('EducationPrimarySchoolUpdateAgentInput')
export class UpdateAgentInput {
  @Field(() => ID)
  childId!: string

  @Field(() => ID)
  agentId!: string

  @Field(() => ID)
  relationTypeId!: string
}

/** DELETE /me/children/{childId}/agents/{agentId}. */
@InputType('EducationPrimarySchoolDeleteAgentInput')
export class DeleteAgentInput {
  @Field(() => ID)
  childId!: string

  @Field(() => ID)
  agentId!: string
}

/** PATCH /me/children/{childId}/health-profile — whole document; `allergies`
 * is a list of allergy ids (contract §4.5). */
@InputType('EducationPrimarySchoolUpdateHealthProfileInput')
export class UpdateHealthProfileInput {
  @Field(() => ID)
  childId!: string

  @Field()
  epipen!: boolean

  @Field()
  medicalDiagnoses!: boolean

  @Field()
  medicationAssistance!: boolean

  @Field(() => [ID])
  allergies!: string[]
}

/** PATCH /me/children/{childId}/language-profile — whole document (§4.6). */
@InputType('EducationPrimarySchoolUpdateLanguageProfileInput')
export class UpdateLanguageProfileInput {
  @Field(() => ID)
  childId!: string

  @Field(() => ID, { nullable: true })
  languageEnvironmentId?: string

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
}
