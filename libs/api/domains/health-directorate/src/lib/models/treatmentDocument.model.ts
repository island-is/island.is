import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateTreatmentDocumentLink } from './treatmentDocumentLink.model'

@ObjectType()
export class HealthDirectorateTreatmentDocument {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({
    nullable: true,
    description:
      'Name of the provider group the conversation carrying the document was opened with.',
  })
  groupName?: string

  @Field(() => GraphQLISODateTime)
  sentAt!: Date

  @Field(() => [HealthDirectorateTreatmentDocumentLink])
  links!: HealthDirectorateTreatmentDocumentLink[]
}
