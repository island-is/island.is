import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class CriminalRecord {
  @Field()
  pdfBase64!: string
  // @Field()
  // pdfBlob!: string
}
