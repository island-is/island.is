import { IsArray, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionIdInput } from './collectionId.input'

@InputType()
export class SignatureCollectionAddListsInput extends SignatureCollectionIdInput {
  @Field()
  @IsString()
  candidateId!: string

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsArray()
  areaIds?: string[]
}
