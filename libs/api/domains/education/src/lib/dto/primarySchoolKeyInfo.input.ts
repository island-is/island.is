import { Field, ID, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

/** Every key-info write is addressed by the routed nemendagrunnur student id,
 * which is also the frigg child id the endpoints take (contract v0.3 §4.3), so
 * the resolver passes it straight through. */
const STUDENT_ID_DESCRIPTION =
  'The nemendagrunnur student id the primary-school screens route on, which is also the MMS key-information child id.'

/** POST /me/children/{childId}/emergency-contacts — name is resolved from
 * Þjóðskrá by MMS. */
@InputType('EducationPrimarySchoolAddAgentInput')
export class AddAgentInput {
  @IsString()
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @IsString()
  @Field()
  nationalId!: string

  @IsString()
  @Field(() => ID)
  relationTypeId!: string
}

/** PATCH /me/children/{childId}/emergency-contacts/{agentId} — only the
 * relation type. */
@InputType('EducationPrimarySchoolUpdateAgentInput')
export class UpdateAgentInput {
  @IsString()
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @IsString()
  @Field(() => ID)
  agentId!: string

  @IsString()
  @Field(() => ID)
  relationTypeId!: string
}

/** DELETE /me/children/{childId}/emergency-contacts/{agentId}. */
@InputType('EducationPrimarySchoolDeleteAgentInput')
export class DeleteAgentInput {
  @IsString()
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @IsString()
  @Field(() => ID)
  agentId!: string
}

/** PATCH /me/children/{childId}/health-profile — whole document; `allergies`
 * is a list of allergy ids (contract §4.5). */
@InputType('EducationPrimarySchoolUpdateHealthProfileInput')
export class UpdateHealthProfileInput {
  @IsString()
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @IsBoolean()
  @Field()
  epipen!: boolean

  @IsBoolean()
  @Field()
  medicalDiagnoses!: boolean

  @IsBoolean()
  @Field()
  medicationAssistance!: boolean

  @IsArray()
  @IsString({ each: true })
  @Field(() => [ID])
  allergies!: string[]
}

/** PATCH /me/children/{childId}/language-profile — whole document (§4.6). */
@InputType('EducationPrimarySchoolUpdateLanguageProfileInput')
export class UpdateLanguageProfileInput {
  @IsString()
  @Field(() => ID, { description: STUDENT_ID_DESCRIPTION })
  studentId!: string

  @IsString()
  @Field(() => ID)
  languageEnvironmentId!: string

  /** Language code from the Ísland.is list (BCP 47, see getAllLanguageCodes) */
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  preferredLanguage?: string

  /** Language code from the Ísland.is list (BCP 47, see getAllLanguageCodes) */
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  languages!: string[]

  @IsBoolean()
  @Field()
  interpreter!: boolean

  @IsBoolean()
  @Field()
  signLanguage!: boolean
}
