import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadFileToCourtResponse {
  @Field(() => Boolean)
  readonly success!: boolean
}
