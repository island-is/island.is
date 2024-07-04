import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadPoliceCaseFileResponse {
  @Field(() => String)
  key!: string

  @Field(() => Int)
  size!: number
}
