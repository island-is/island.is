import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RequestFileSignatureResponse {
  @Field()
  controlCode!: string

  @Field()
  documentToken!: string
}
