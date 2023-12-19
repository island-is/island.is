import { IsArray, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionListNationalIdsInput {
  @Field()
  @IsString()
  listId!: string

  @Field(() => [String])
  @IsArray()
  nationalIds!: string[]
}
@InputType()
export class SignatureCollectionNationalIdsInput {
  @Field(() => [String])
  @IsArray()
  nationalIds!: string[]
}
