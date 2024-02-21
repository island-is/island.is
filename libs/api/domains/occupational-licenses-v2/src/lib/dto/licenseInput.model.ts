import { Field, InputType } from '@nestjs/graphql'

@InputType('OccupationalLicensesV2LicenseInput')
export class LicenseInput {
  @Field()
  id!: string
}
