import { Field, InputType } from '@nestjs/graphql'
import type { Locale } from '@island.is/shared/types'

@InputType('OccupationalLicensesV2LicenseInput')
export class LicenseInput {
  @Field()
  id!: string

  @Field(() => String)
  locale!: Locale
}
