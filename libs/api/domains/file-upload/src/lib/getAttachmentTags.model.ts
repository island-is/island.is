import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FileUploadTag {
  @Field(() => String)
  key!: string

  @Field(() => String)
  value!: string
}