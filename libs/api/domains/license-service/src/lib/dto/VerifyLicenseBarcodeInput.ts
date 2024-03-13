import { Field, InputType } from '@nestjs/graphql'

@InputType('VerifyLicenseBarcodeInput')
export class VerifyLicenseBarcodeInput {
  @Field(() => String)
  data!: string
}
