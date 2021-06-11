import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SearchInput {
  @Allow()
  @Field()
  readonly terms!: string
}
