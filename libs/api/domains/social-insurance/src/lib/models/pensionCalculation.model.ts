import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('SocialInsurancePensionCalculationResponseItem')
class PensionCalculationItem {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Number, { nullable: true })
  monthlyAmount?: number

  @Field(() => Number, { nullable: true })
  yearlyAmount?: number
}

@ObjectType('SocialInsurancePensionCalculationResponse')
export class PensionCalculationResponse {
  @CacheField(() => [PensionCalculationItem])
  items!: PensionCalculationItem[]
}
