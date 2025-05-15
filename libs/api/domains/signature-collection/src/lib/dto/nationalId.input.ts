import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { SignatureCollectionCollectionTypeInput } from './collectionType.input'

@InputType()
export class SignatureCollectionNationalIdInput extends SignatureCollectionCollectionTypeInput {
  @Field()
  @IsString()
  nationalId!: string
}
