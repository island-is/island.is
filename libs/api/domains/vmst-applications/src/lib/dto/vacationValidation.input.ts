import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsString, IsDate } from 'class-validator'

@InputType('VmstApplicationsVacationValidationInput')
export class VmstApplicationsVacationValidationInput {
  @Field()
  @IsBoolean()
  hasUnpaidVacationTime!: boolean

  @Field()
  @IsString()
  ledger!: string

  @Field()
  @IsString()
  accountNumber!: string
}

@InputType('UnpaidVacationField')
class UnpaidVacationField {
  @Field({ nullable: true })
  @IsInt({})
  unpaidVacationDays?: number

  @Field({ nullable: true })
  @IsDate()
  unpaidVacationStart?: Date
}
