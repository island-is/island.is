import { Field, ObjectType, ID } from '@nestjs/graphql'

import type { MunicipalitySettings } from '@island.is/financial-aid/shared/lib'

import { Municipality } from '@island.is/financial-aid/shared/lib'
import { MunicipalitySettingsModel } from './municipalitySettings.model'

@ObjectType()
export class MunicipalityModel implements Municipality {
  @Field(() => ID)
  readonly id!: string

  // @Field()
  // readonly created!: string

  // @Field()
  // readonly modified!: string

  @Field()
  readonly name!: string

  @Field(() => MunicipalitySettingsModel, { nullable: false })
  readonly settings!: MunicipalitySettings
}
