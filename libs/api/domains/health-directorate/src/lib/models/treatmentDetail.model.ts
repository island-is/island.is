import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateTreatment } from './treatment.model'
import { HealthDirectorateTreatmentConversationSummary } from './treatmentConversationSummary.model'

@ObjectType()
export class HealthDirectorateTreatmentDetail extends HealthDirectorateTreatment {
  @Field(() => [HealthDirectorateTreatmentConversationSummary], {
    description: 'Newest first, capped upstream.',
  })
  recentConversations!: HealthDirectorateTreatmentConversationSummary[]

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description:
      'Stamped with the upstream server-local clock — never sort or compare against messaging timestamps, which are UTC.',
  })
  lastQuestionnaireSentAt?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastDocumentSentAt?: Date
}
