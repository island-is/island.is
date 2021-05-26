import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { RequirementKey } from '../drivingLicense.type'

registerEnumType(RequirementKey, { name: 'RequirementKey' })

@ObjectType()
export class ApplicationEligibilityRequirement {
  @Field(() => RequirementKey)
  key!: RequirementKey

  @Field()
  requirementMet!: boolean
}
