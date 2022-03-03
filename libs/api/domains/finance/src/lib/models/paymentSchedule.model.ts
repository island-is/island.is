import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaymentSchedule {
  @Field()
  approvalDate!: string

  @Field()
  paymentCount!: string

  @Field()
  scheduleName!: string

  @Field()
  scheduleNumber!: string

  @Field()
  scheduleStatus!: string

  @Field()
  scheduleType!: string

  @Field()
  totalAmount!: number
}
@ObjectType()
export class PaymentScheduleData {
  @Field()
  nationalId!: string

  @Field(() => [PaymentSchedule])
  paymentSchedules!: PaymentSchedule[]
}

@ObjectType()
export class PaymentScheduleModel {
  @Field(() => PaymentScheduleData)
  myPaymentSchedule!: PaymentScheduleData
}
