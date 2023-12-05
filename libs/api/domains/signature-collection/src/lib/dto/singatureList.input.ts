import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionOwnerInput } from './owner.input'

@InputType()
export class SignatureCollectionListInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => SignatureCollectionOwnerInput)
  owner!: SignatureCollectionOwnerInput
}
