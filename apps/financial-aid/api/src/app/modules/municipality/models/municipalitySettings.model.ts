import { Field, ObjectType, ID, Float } from '@nestjs/graphql'

import type { MunicipalitySettings } from '@island.is/financial-aid/shared/lib'

import { MunicipalityAidModel } from './municipalityAid.model'

@ObjectType()
export class MunicipalitySettingsModel implements MunicipalitySettings {
  @Field()
  readonly homePage?: string

  @Field()
  readonly aid!: MunicipalityAidModel
}
