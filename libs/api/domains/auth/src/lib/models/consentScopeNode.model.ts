import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthConsentScopeNode')
export class ConsentScopeNode {
  @Field(() => ID)
  name!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Boolean, { nullable: true })
  hasConsent?: boolean

  @Field(() => [ConsentScopeNode], { nullable: true })
  children?: ConsentScopeNode[]

  constructor(scope: ConsentScopeNode) {
    Object.assign(this, scope)
  }
}
