import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'
import { PaginationInput } from '@island.is/nest/pagination'

@InputType()
export class HousingBenefitPaymentsInput extends PaginationInput() {
  @Field(() => GraphQLISODateTime, { nullable: true })
  dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date
}
