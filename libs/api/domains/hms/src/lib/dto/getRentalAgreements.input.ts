import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('HmsGetRentalAgreementsInput')
export class GetRentalAgreementsInput {
  @Field(() => Boolean, { nullable: true })
  hideInactiveAgreements?: boolean

  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  pageSize?: number
}
