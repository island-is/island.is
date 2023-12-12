import { Field, ObjectType } from '@nestjs/graphql'
import { InsuranceConfirmation } from './insuranceConfirmation.model'
import { InsuranceError } from './insuranceError.model'

@ObjectType('RightsPortalInsuranceConfirmationResponse')
export class InsuranceConfirmationResponse {
  @Field(() => [InsuranceConfirmation])
  items!: InsuranceConfirmation[]

  @Field(() => [InsuranceError])
  errors!: InsuranceError[]
}
