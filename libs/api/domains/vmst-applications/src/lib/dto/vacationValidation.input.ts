import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsDate } from 'class-validator'

@InputType('UnpaidVacationField')
class UnpaidVacationField {
  @Field({ nullable: true })
  @IsInt({})
  unpaidVacationDays?: number

  @Field({ nullable: true })
  @IsDate()
  unpaidVacationStart?: Date

  @Field({ nullable: true })
  @IsDate()
  unpaidVacationEnd?: Date
}

@InputType('VmstApplicationsVacationValidationInput')
export class VmstApplicationsVacationValidationInput {
  @Field()
  @IsBoolean()
  hasUnpaidVacationTime!: boolean

  @Field(() => [UnpaidVacationField], {
    nullable: true,
  })
  unpaidVacations?: UnpaidVacationField[]

  @Field({ nullable: true })
  @IsDate()
  resignationEnds!: Date
}
