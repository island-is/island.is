import { IsArray, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionNationalIdsInput {
  @Field()
  @IsString()
  listId!: string

  @Field(() => [String])
  @IsArray()
  nationalIds!: string[]
}
