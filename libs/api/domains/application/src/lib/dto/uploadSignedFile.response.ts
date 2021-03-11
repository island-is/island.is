import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadSignedFileResponse {
  @Field()
  documentSigned!: boolean
}
