import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthConsentScope')
export class ConsentScope {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Boolean)
  hasConsent!: boolean

  constructor(scope: ConsentScope) {
    Object.assign(this, scope)
  }
}
