import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionCollectionTypeInput } from './collectionType.input'

@InputType()
export class SignatureCollectionCanSignFromPaperInput extends SignatureCollectionCollectionTypeInput {
  @Field()
  @IsString()
  signeeNationalId!: string
  @Field()
  @IsString()
  listId!: string
}
