import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class DataUploadResponse {
  @Field()
  message?: string

  @Field()
  id?: string

  @Field()
  caseNumber?: string
}
