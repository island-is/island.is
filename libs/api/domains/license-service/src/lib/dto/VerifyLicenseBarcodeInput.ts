import { Field, InputType } from '@nestjs/graphql'

@InputType('VerifyLicenseBarcodeInput')
export class VerifyLicenseBarcodeInput {
  @Field()
  data!: string
}
