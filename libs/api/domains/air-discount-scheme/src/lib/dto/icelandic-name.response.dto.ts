import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteNameResponse {
  @Field()
  readonly id!: number
}
