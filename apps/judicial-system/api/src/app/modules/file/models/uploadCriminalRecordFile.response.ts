import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadCriminalRecordFileResponse {
  @Field(() => String)
  readonly name!: string

  @Field(() => String)
  readonly key!: string

  @Field(() => Int)
  readonly size!: number

  @Field(() => String)
  readonly type!: string
}
