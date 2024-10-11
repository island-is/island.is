import { InsuranceStatusType } from '../overview.types'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(InsuranceStatusType, {
  name: 'RightsPortalInsuranceStatusType',
})

@ObjectType('RightsPortalInsuranceStatus')
export class InsuranceStatus {
  @Field(() => String, { nullable: true })
  display?: string | null

  @Field(() => InsuranceStatusType, { nullable: true })
  code?: string | null
}
