import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MunicipalityByIdsQueryInput {
  @Allow()
  @Field()
  readonly ids!: string[]
}
