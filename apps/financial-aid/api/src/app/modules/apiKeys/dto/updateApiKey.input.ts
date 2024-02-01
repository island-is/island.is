import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import type { Aid } from '@island.is/financial-aid/shared/lib'
import { AidInput } from '../../aid'

@InputType()
export class UpdateApiKeyForMunicipalityMutation {
  @Allow()
  @Field()
  readonly name!: string
}
