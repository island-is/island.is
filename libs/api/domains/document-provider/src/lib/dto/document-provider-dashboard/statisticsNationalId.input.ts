import { Field, Int, InputType } from '@nestjs/graphql'

@InputType('GetStatisticsByNationalId')
export class GetStatisticsByNationalId {
  @Field()
  nationalId!: string

  @Field(() => [Int], { nullable: true })
  categories?: Array<number>

  @Field(() => Date, { nullable: true })
  from?: Date

  @Field(() => Date, { nullable: true })
  to?: Date
}
