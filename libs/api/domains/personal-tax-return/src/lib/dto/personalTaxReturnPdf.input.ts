import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PersonalTaxReturnPdfInput {
  @Allow()
  @Field(() => String)
  uploadUrl!: string

  @Allow()
  @Field(() => String)
  folder!: string
}
