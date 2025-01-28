import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { CreateFileInput } from './createFile.input'

@InputType()
export class CreateCivilClaimantFileInput extends CreateFileInput {
  @Allow()
  @Field(() => ID)
  readonly civilClaimantId!: string
}
