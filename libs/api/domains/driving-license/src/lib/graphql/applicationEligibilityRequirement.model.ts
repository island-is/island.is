import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ApplicationEligibilityRequirement {
  @Field(() => ID)
  key!: string

  @Field()
  requirementMet!: boolean
}

