import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { RequirementKey } from '../../drivingLicense.type'

registerEnumType(RequirementKey, { name: 'RequirementKey' })

@ObjectType()
export class ApplicationEligibilityRequirement {
  @Field(() => RequirementKey)
  key!: RequirementKey

  @Field()
  requirementMet!: boolean

  @Field({ nullable: true })
  daysOfResidency?: number

  @Field({ nullable: true })
  errorCode?: string

  @Field({ nullable: true })
  messageIs?: string

  @Field({ nullable: true })
  messageEn?: string
}
