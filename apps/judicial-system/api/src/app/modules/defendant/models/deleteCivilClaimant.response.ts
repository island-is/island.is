import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteCivilClaimantResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
