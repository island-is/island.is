import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FarmerLandSubsidyPaymentCategory {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string
}
