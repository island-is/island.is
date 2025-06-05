import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionCollectionTypeInput } from './collectionType.input'

@InputType()
export class SignatureCollectionListIdInput {
  @Field()
  @IsString()
  listId!: string
}

@InputType()
export class SignatureCollectionListIdWithTypeInput extends SignatureCollectionCollectionTypeInput {
  @Field()
  @IsString()
  listId!: string
}
