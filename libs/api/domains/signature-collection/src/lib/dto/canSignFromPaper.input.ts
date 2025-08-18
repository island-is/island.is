import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

@InputType()
export class SignatureCollectionCanSignFromPaperInput extends SignatureCollectionBaseInput {
  @Field()
  @IsString()
  signeeNationalId!: string
  @Field()
  @IsString()
  listId!: string
}
