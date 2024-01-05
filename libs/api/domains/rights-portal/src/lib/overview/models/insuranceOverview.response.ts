import { ObjectType, Field } from '@nestjs/graphql'
import { InsuranceOverview } from './insuranceOverview.model'
import { InsuranceError } from './insuranceError.model'

@ObjectType('RightsPortalInsuranceOverviewResponse')
export class InsuranceOverviewResponse {
  @Field(() => [InsuranceOverview])
  items!: InsuranceOverview[]

  @Field(() => [InsuranceError])
  errors!: InsuranceError[]
}
