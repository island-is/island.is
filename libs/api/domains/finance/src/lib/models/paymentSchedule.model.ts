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

  @Field()
  unpaidAmount!: number

  @Field()
  unpaidCount!: string

  @Field()
  downloadServiceURL!: string

  @Field({ nullable: true })
  documentID?: string
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
  @Field(() => PaymentScheduleData, { nullable: true })
  myPaymentSchedule?: PaymentScheduleData
}

@ObjectType()
export class AccumulatedPayments {
  @Field()
  payAmount!: number

  @Field()
  payAmountAccumulated!: number

  @Field()
  payDate!: string

  @Field()
  payExplanation!: string
}
@ObjectType()
export class DetailedSchedule {
  @Field()
  paidAmount!: number

  @Field()
  paidAmountAccumulated!: number

  @Field()
  paidDate!: string

  @Field()
  paymentNumber!: string

  @Field(() => [AccumulatedPayments], { nullable: true })
  payments!: AccumulatedPayments[]

  @Field()
  plannedAmount!: number

  @Field()
  plannedAmountAccumulated!: number

  @Field()
  plannedDate!: string
}

@ObjectType()
export class PaymentScheduleDetailData {
  @Field(() => [DetailedSchedule])
  myDetailedSchedule!: DetailedSchedule[]
}

@ObjectType()
export class PaymentScheduleDetailModel {
  @Field(() => PaymentScheduleDetailData)
  myDetailedSchedules!: PaymentScheduleDetailData
}
