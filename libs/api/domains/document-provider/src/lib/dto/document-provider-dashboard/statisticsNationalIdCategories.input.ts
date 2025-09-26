import { Field, InputType } from '@nestjs/graphql'

@InputType('GetStatisticsCategoriesByNationalId')
export class GetStatisticsCategoriesByNationalId {
  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
