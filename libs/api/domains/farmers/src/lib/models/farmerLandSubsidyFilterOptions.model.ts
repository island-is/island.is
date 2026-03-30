import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('FarmerLandSubsidyContract')
export class FarmerLandSubsidyContract {
  @Field()
  contractId!: string

  @Field()
  contractName!: string
}

@ObjectType('FarmerLandSubsidyPaymentCategory')
export class FarmerLandSubsidyPaymentCategory {
  @Field(() => Int)
  paymentCategoryId!: number

  @Field()
  paymentCategoryName!: string
}

@ObjectType('FarmerLandSubsidyFilterOptions')
export class FarmerLandSubsidyFilterOptions {
  @Field(() => [FarmerLandSubsidyContract], { nullable: true })
  contracts?: FarmerLandSubsidyContract[]

  @Field(() => [FarmerLandSubsidyPaymentCategory], { nullable: true })
  paymentCategories?: FarmerLandSubsidyPaymentCategory[]
}
