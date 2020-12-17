import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AudienceAndScope {
  constructor(audience: string, scope: string) {
    this.audience = audience
    this.scope = scope
  }

  @Field(() => String)
  audience: string

  @Field(() => String)
  scope: string
}
