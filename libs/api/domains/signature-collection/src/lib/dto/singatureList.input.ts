import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { OwnerInput } from './owner.input'

@InputType()
export class SignatureListInput {
  @Field()
  @IsString()
  id!: string

  @Field(() => OwnerInput)
  owner!: OwnerInput
}
