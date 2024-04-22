import { IsArray } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionIdInput } from './collectionId.input'

@InputType()
export class SignatureCollectionCancelListsInput extends SignatureCollectionIdInput {
  @Field(() => [String], { nullable: false, defaultValue: [] })
  @IsArray()
  listIds?: string[]
}
