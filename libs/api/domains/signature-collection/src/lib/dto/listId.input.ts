import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionCollectionTypeInput } from './collectionType.input'

@InputType()
export class SignatureCollectionListIdInput extends SignatureCollectionCollectionTypeInput {
  @Field()
  @IsString()
  listId!: string
}
