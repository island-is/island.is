import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FileContentAsBase64Response {
  @Field()
  content!:string
}
