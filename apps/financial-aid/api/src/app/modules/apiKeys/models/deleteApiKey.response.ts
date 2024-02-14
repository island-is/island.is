import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteApiKeyResponse {
  @Field(() => Boolean)
  readonly success!: boolean
}
