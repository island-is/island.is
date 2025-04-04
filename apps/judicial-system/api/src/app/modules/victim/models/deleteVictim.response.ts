import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteVictimResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
