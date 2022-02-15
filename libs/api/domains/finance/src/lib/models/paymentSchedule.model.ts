import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaymentScheduleModel {
  @Field()
  nationalId!: string

  @Field(() => [PaymentSchedule])
  paymentSchedule!: PaymentSchedule[]
}

@ObjectType()
export class PaymentSchedule {
  @Field()
  approvalDate!: string

  @Field()
  scheduleType!: string

  @Field()
  scheduleName!: string

  @Field()
  paymentCount!: string

  @Field()
  scheduleStatus!: string

  @Field()
  scheduleNumber!: string

  @Field()
  totalAmount!: string
}
