import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteCourtDocumentResponse {
  @Field(() => Boolean)
  deleted!: boolean
}
