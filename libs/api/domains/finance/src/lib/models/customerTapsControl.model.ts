import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceCustomerTapsControlModel')
export class CustomerTapsControlModel {
  @Field()
  RecordsTap!: boolean

  @Field()
  employeeClaimsTap!: boolean

  @Field()
  localTaxTap!: boolean

  @Field()
  schedulesTap!: boolean
}
