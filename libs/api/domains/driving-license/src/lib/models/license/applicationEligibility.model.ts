import { Field, ObjectType } from '@nestjs/graphql'
import { ApplicationEligibilityRequirement } from './applicationEligibilityRequirement.model'

@ObjectType()
export class ApplicationEligibility {
  @Field()
  isEligible!: boolean

  @Field(() => [ApplicationEligibilityRequirement])
  requirements!: ApplicationEligibilityRequirement[]
}
