import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RequestSignatureResponse {
  @Field(() => String)
  controlCode!: string

  @Field(() => String)
  documentToken!: string
}
