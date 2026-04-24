import { Field, ObjectType } from '@nestjs/graphql'
import { FarmerLandSubsidyContract } from './farmerLandSubsidyContract.model'
import { FarmerLandSubsidyPaymentCategory } from './farmerLandSubsidyPaymentCategory.model'

@ObjectType()
export class FarmerLandSubsidyFilterOptions {
  @Field(() => [FarmerLandSubsidyContract])
  contracts!: FarmerLandSubsidyContract[]

  @Field(() => [FarmerLandSubsidyPaymentCategory])
  paymentCategories!: FarmerLandSubsidyPaymentCategory[]
}
