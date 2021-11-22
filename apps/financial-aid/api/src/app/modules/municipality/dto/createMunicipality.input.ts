import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import type { CreateMunicipality } from '@island.is/financial-aid/shared/lib'

@InputType()
export class CreateMunicipalityInput implements CreateMunicipality {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly municipalityId!: string
}
