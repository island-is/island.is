import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadCriminalRecordFileResponse {
  @Field(() => String)
  key!: string

  @Field(() => Int)
  size!: number
}
