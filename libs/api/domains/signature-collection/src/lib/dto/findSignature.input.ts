import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionFindSignatureInput {
  @Field()
  @IsString()
  listId!: string

  @Field()
  @IsString()
  query!: string
}
