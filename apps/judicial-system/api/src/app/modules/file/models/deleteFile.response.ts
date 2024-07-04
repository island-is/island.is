import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteFileResponse {
  @Field(() => Boolean)
  readonly success!: boolean
}
