import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetMunicipalityIdsQueryInput {
  @Allow()
  @Field(() => [String])
  readonly municipalityIds!: string[]
}
