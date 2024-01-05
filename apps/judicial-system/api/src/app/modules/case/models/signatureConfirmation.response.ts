import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureConfirmationResponse {
  @Field()
  documentSigned!: boolean

  @Field(() => Int, { nullable: true })
  code?: number

  @Field({ nullable: true })
  message?: string
}
