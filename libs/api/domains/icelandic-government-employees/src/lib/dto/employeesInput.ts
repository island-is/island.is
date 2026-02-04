import { LocaleEnum } from '@island.is/shared/types'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'

registerEnumType(LocaleEnum, {
  name: 'Locale',
  description: 'Available locales',
})

@InputType('IcelandicGovernmentEmployeesInput')
export class EmployeesInput {
  @Field()
  @IsString()
  organizationId!: string

  @Field({ defaultValue: true })
  @IsBoolean()
  activeOnly!: boolean

  @Field(() => LocaleEnum)
  @IsLocale()
  locale!: LocaleEnum
}
