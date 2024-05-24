import { InsuranceStatusType } from '../overview.types'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(InsuranceStatusType, {
  name: 'RightsPortalInsuranceStatusType',
})

@ObjectType('RightsPortalInsuranceStatus')
export class InsuranceStatus {
  @Field()
  display!: string

  @Field(() => InsuranceStatusType)
  code!: InsuranceStatusType
}
