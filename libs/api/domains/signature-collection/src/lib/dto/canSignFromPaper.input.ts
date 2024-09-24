import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionCanSignFromPaperInput {
  @Field()
  @IsString()
  signeeNationalId!: string
  @Field()
  @IsString()
  listId!: string
}
