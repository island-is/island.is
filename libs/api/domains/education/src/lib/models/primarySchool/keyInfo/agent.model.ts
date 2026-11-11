import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { KeyInfoActorKind } from '../../../enums/primarySchoolKeyInfo.enum'

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

  @Field()
  title!: string
}

/** Who registered the contact. The UI must not render a "Skráð af" line when
 * `kind` is `unknown`. */
@ObjectType('EducationPrimarySchoolAgentCreatedBy')
export class AgentCreatedBy {
  @Field(() => KeyInfoActorKind)
  kind!: KeyInfoActorKind

  @Field({ nullable: true })
  displayName?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  at?: Date
}

/** An emergency contact — GET /me/children/{childId}/emergency-contacts
 * (contract §4.4). */
@ObjectType('EducationPrimarySchoolAgent')
export class PrimarySchoolAgent {
  @Field(() => ID)
  id!: string

  @Field(() => AgentPerson)
  person!: AgentPerson

  /** Absent on legacy records MMS has no relation type for. */
  @Field(() => AgentRelationType, { nullable: true })
  relationType?: AgentRelationType

  @Field(() => AgentCreatedBy)
  createdBy!: AgentCreatedBy

  /** Computed by MMS, never by the frontend. */
  @Field()
  canEdit!: boolean
}
