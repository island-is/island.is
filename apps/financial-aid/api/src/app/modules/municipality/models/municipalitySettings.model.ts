import { Field, ObjectType, ID, Float } from '@nestjs/graphql'

import type { MunicipalitySettings } from '@island.is/financial-aid/shared/lib'

import { MunicipalityAidModal } from './municipalityAid.model'

@ObjectType()
export class MunicipalitySettingsModal implements MunicipalitySettings {
  @Field()
  readonly homePage?: string

  @Field()
  readonly aid!: MunicipalityAidModal
}
