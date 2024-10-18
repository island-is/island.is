import { IsNumber, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionUploadPaperSignatureInput {
  @Field()
  @IsString()
  listId!: string

  @Field()
  @IsNumber()
  pageNumber!: number

  @Field()
  @IsString()
  nationalId!: string
}
