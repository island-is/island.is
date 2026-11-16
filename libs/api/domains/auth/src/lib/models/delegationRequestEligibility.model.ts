import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthDelegationRequestEligibility')
export class DelegationRequestEligibility {
  @Field(() => Boolean)
  canRequest!: boolean

  @Field(() => String, {
    nullable: true,
    description: 'The first limit that stops a new request.',
  })
  reason?: string | null
}
