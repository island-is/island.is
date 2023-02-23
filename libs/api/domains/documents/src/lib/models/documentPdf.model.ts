import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class DocumentPdf {
  @Field(() => String, { nullable: true })
  file?: string
}
