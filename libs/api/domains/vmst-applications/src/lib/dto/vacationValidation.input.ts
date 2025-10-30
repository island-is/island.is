import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsInt } from 'class-validator'

@InputType('UnpaidVacationField')
class UnpaidVacationField {
  @Field({ nullable: true })
  @IsInt({})
  unpaidVacationDays?: number

  @Field({ nullable: true })
  unpaidVacationStart?: string

  @Field({ nullable: true })
  unpaidVacationEnd?: string
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
  resignationEnds!: string
}
