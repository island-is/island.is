import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { HealthDirectorateTreatmentDocumentLink } from './treatmentDocumentLink.model'

@ObjectType()
export class HealthDirectorateTreatmentDocument {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field(() => GraphQLISODateTime)
  sentAt!: Date

  @Field(() => [HealthDirectorateTreatmentDocumentLink])
  links!: HealthDirectorateTreatmentDocumentLink[]
}
