import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VerifyPkPassInput {
  @Field()
  data!: string
}
