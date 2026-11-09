import { Field, ID, InputType } from '@nestjs/graphql'

/** Every key-info write is addressed by the routed nemendagrunnur student id;
 * the resolver translates it to the frigg child id the endpoints take. */
const STUDENT_ID_DESCRIPTION =
  'The nemendagrunnur student id the primary-school screens route on (not the MMS key-information child id).'

/** POST /me/children/{childId}/emergency-contacts — name is resolved from
 * Þjóðskrá by MMS. */
@InputType('EducationPrimarySchoolAddAgentInput')
export class AddAgentInput {
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @Field()
  nationalId!: string

  @Field(() => ID)
  relationTypeId!: string
}

/** PATCH /me/children/{childId}/emergency-contacts/{agentId} — only the
 * relation type. */
@InputType('EducationPrimarySchoolUpdateAgentInput')
export class UpdateAgentInput {
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @Field(() => ID)
  agentId!: string

  @Field(() => ID)
  relationTypeId!: string
}

/** DELETE /me/children/{childId}/emergency-contacts/{agentId}. */
@InputType('EducationPrimarySchoolDeleteAgentInput')
export class DeleteAgentInput {
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @Field(() => ID)
  agentId!: string
}

/** PATCH /me/children/{childId}/health-profile — whole document; `allergies`
 * is a list of allergy ids (contract §4.5). */
@InputType('EducationPrimarySchoolUpdateHealthProfileInput')
export class UpdateHealthProfileInput {
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

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
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @Field(() => ID)
  languageEnvironmentId!: string

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
}
