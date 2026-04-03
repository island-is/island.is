import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'
import { LocaleEnum } from '@island.is/shared/types'

registerEnumType(LocaleEnum, {
  name: 'Locale',
  description: 'Available locales',
})

@ArgsType()
export class IcelandicGovernmentInstitutionsEmployeesInput {
  @IsString()
  @Field()
  organizationId!: string

  @Field(() => LocaleEnum)
  @IsLocale()
  locale!: LocaleEnum
}
