import { Field, InputType } from '@nestjs/graphql'

@InputType('LicenseServiceV2VerifyLicenseBarcodeInput')
export class VerifyLicenseBarcodeInput {
  @Field()
  data!: string
}
