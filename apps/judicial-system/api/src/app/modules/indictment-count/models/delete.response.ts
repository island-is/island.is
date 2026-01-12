import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
