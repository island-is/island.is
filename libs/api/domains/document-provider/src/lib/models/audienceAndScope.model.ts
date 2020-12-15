import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AudienceAndScope {
  @Field(() => String)
  audience!: string

  @Field(() => String)
  scope!: string
}
