import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteAppealCourtSessionResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
