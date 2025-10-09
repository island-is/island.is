import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteCourtSessionResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
