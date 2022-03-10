import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteTokenResponse {
  @Field(() => Boolean)
  success!: boolean
}
