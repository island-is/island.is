import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VerifyBarcodeInput {
  @Field(() => String)
  token!: string
}
