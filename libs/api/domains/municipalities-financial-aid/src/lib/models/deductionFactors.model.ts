import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeductionFactorsModel {
  @Field()
  readonly amount!: number

  @Field()
  readonly description!: string

  @Field()
  readonly amountId!: string
}
