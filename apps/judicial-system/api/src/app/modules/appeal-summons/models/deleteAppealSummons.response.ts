import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteAppealSummonsResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
