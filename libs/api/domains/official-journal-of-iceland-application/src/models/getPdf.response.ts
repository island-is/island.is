import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OJOIAGetPdfResponse')
export class GetPdfResponse {
  @Field()
  pdf!: string
}
