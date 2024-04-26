import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadPoliceCaseFileResponse {
  @Field()
  key!: string

  @Field(() => Int)
  size!: number
}
