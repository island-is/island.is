import { Field, ObjectType, ID } from '@nestjs/graphql'

import type {
  MunicipalitySettings,
  MunicipalityAid,
} from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class MunicipalitySettingsModal implements MunicipalitySettings {
  @Field()
  readonly homePage!: string

  @Field(() => Number)
  readonly aid!: MunicipalityAid
}
