import { Field, InputType } from '@nestjs/graphql'
import type { Locale } from '@island.is/shared/types'

@InputType('OccupationalLicensesLicenseInput')
export class LicenseInput {
  @Field()
  id!: string

  @Field(() => String)
  locale!: Locale
}
