import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionCollectionTypeInput } from './collectionType.input'

@InputType()
export class SignatureCollectionIdInput extends SignatureCollectionCollectionTypeInput {
  @Field()
  @IsString()
  collectionId!: string
}
