import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteDefendantResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
