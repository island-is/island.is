import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionListIdInput {
  @Field()
  @IsString()
  listId!: string
}
