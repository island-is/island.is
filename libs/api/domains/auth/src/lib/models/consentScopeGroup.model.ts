import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ConsentScope } from './consentScope.model'

@ObjectType('AuthConsentScopeGroup')
export class ConsentScopeGroup {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => [ConsentScope], { nullable: true })
  children?: ConsentScope[]

  constructor(scope: ConsentScopeGroup) {
    Object.assign(this, scope)
  }
}
