import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SearchCasesQueryInput {
  @Allow()
  @Field(() => String)
  readonly query!: string
}
