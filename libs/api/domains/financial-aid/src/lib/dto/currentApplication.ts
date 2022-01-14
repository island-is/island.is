import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CurrentApplicationResponse {
  @Field({ nullable: true })
  currentApplicationId?: string
}
