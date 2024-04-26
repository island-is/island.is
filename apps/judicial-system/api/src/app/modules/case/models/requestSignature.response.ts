import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RequestSignatureResponse {
  @Field()
  controlCode!: string

  @Field()
  documentToken!: string
}
