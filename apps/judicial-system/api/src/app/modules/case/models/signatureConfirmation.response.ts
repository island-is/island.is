import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureConfirmationResponse {
  @Field(() => Boolean)
  documentSigned!: boolean

  @Field(() => Int, { nullable: true })
  code?: number

  @Field(() => String, { nullable: true })
  message?: string
}
