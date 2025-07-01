import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

@InputType()
export class SignatureCollectionNationalIdInput extends SignatureCollectionBaseInput {
  @Field()
  @IsString()
  nationalId!: string
}
