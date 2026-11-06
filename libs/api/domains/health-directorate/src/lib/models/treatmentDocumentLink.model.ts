import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateTreatmentDocumentLink {
  @Field()
  label!: string

  @Field()
  href!: string
}
