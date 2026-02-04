import { ArgsType, Field, registerEnumType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'
import { LocaleEnum } from '@island.is/shared/types'

registerEnumType(LocaleEnum, {
  name: 'Locale',
  description: 'Available locales',
})

@ArgsType()
export class IcelandicGovernmentEmployeesInput {
  @IsString()
  @Field()
  organizationId!: string

  @IsBoolean()
  @Field()
  activeEmployeesOnly!: boolean

  @Field(() => LocaleEnum)
  @IsLocale()
  locale!: LocaleEnum
}
