import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceDebtStatusModel')
export class DebtStatusModel {
  @Field(() => [DebtStatus])
  myDebtStatus!: DebtStatus[]
}

@ObjectType('FinanceDebtStatus')
export class DebtStatus {
  @Field()
  totalAmount!: number

  @Field()
  approvedSchedule!: number

  @Field()
  possibleToSchedule!: number

  @Field()
  notPossibleToSchedule?: number
}
