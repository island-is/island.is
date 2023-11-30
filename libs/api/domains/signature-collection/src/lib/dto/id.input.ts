import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionIdInput {
  @Field()
  @IsString()
  id!: string
}
