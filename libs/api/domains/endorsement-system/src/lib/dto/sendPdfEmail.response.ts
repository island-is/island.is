import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class sendPdfEmailResponse {
  @Field()
  success!: boolean
}