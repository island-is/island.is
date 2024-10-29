import { IsNumber } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionSignatureIdInput } from './signatureId.input'

@InputType()
export class SignatureCollectionSignatureUpdateInput extends SignatureCollectionSignatureIdInput {
  @Field()
  @IsNumber()
  pageNumber!: number
}
