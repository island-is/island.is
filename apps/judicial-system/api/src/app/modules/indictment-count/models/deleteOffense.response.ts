import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteOffenseResponse {
  @Field(() => Boolean)
  deleted!: boolean
}