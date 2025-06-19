import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

@InputType()
export class SignatureCollectionIdInput extends SignatureCollectionBaseInput {
  @Field()
  @IsString()
  collectionId!: string
}
