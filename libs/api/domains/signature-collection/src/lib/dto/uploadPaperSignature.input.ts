import { IsNumber, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

@InputType()
export class SignatureCollectionUploadPaperSignatureInput extends SignatureCollectionBaseInput {
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
