import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FindSignatureInput {
  @Field()
  @IsString()
  listId!: string

  @Field()
  @IsString()
  query!: string
}
