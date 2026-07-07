import { LocaleEnum } from '@island.is/nest/graphql'
import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'

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
