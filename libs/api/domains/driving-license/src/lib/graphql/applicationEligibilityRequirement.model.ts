import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

export enum RequirementKey {
  drivingAssessmentMissing = 'DrivingAssessmentMissing',
  drivingSchoolMissing = 'DrivingSchoolMissing',
  deniedByService = 'DeniedByService',
}

registerEnumType(RequirementKey, { name: 'RequirementKey' })

@ObjectType()
export class ApplicationEligibilityRequirement {
  @Field(() => RequirementKey)
  key!: RequirementKey

  @Field()
  requirementMet!: boolean
}
