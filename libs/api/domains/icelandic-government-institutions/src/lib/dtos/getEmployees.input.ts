import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { IsLocale } from '@island.is/nest/core'
import { LocaleEnum } from '@island.is/nest/graphql'

@InputType('IcelandicGovernmentInstitutionsEmployeesInput')
export class EmployeesInput {
  @IsString()
  @Field()
  organizationId!: string

  @Field(() => LocaleEnum)
  @IsLocale()
  locale!: LocaleEnum
}
