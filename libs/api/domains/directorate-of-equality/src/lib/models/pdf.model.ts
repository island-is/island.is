import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityPdf')
export class Pdf {
  @Field(() => String, { description: 'The PDF file, base64 encoded' })
  content!: string
}
