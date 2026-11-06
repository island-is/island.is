import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LocalizedText } from './localizedText.model'

/** The person behind an emergency contact. Email / phone are never exposed
 * here — they are the contact's own (contract §4.4). */
@ObjectType('EducationPrimarySchoolAgentPerson')
export class AgentPerson {
  @Field()
  nationalId!: string

  @Field()
  name!: string
}

@ObjectType('EducationPrimarySchoolAgentRelationType')
export class AgentRelationType {
  @Field(() => ID)
  id!: string

  @Field(() => LocalizedText)
  title!: LocalizedText
}

/** Who registered the contact. `kind` is guardian | organization | unknown;
 * the UI must not render a "Skráð af" line when `kind === 'unknown'`. */
@ObjectType('EducationPrimarySchoolAgentCreatedBy')
export class AgentCreatedBy {
  @Field()
  kind!: string

  @Field({ nullable: true })
  displayName?: string

  @Field({ nullable: true })
  at?: string
}

/** An emergency contact — GET /me/children/{childId}/agents (contract §4.4). */
@ObjectType('EducationPrimarySchoolAgent')
export class PrimarySchoolAgent {
  @Field(() => ID)
  id!: string

  @Field(() => AgentPerson)
  person!: AgentPerson

  @Field(() => AgentRelationType)
  relationType!: AgentRelationType

  @Field(() => AgentCreatedBy)
  createdBy!: AgentCreatedBy

  /** Computed by MMS, never by the frontend. */
  @Field()
  canEdit!: boolean
}
