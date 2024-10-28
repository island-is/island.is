import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PdfModel {
  @Field()
  readonly file!: string
}
