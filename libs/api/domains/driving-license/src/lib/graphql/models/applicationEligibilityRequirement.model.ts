import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { RequirementKey } from '../../drivingLicense.type'

registerEnumType(RequirementKey, { name: 'RequirementKey' })

@ObjectType()
export class ResidencyDurationType {
  @Field({ nullable: true })
  residencyDuration?: number
}

@ObjectType()
export class ApplicationEligibilityRequirement {
  @Field(() => RequirementKey)
  key!: RequirementKey

  @Field()
  requirementMet!: boolean

  @Field(() => ResidencyDurationType, { nullable: true })
  metaData?: ResidencyDurationType
}
