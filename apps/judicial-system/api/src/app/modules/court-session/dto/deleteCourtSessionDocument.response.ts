import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteCourtSessionDocumentResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
