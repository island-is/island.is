import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetDocumentPDFByIdInput {
  @Field()
  @IsString()
  pdfId!: string
}
