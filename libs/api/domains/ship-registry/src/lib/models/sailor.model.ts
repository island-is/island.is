import { ObjectType } from '@nestjs/graphql'
import { LocaleEnum } from '@island.is/nest/graphql'

@ObjectType()
export class ShipRegistrySailor {}

export interface ShipRegistrySailorBase {
  locale: LocaleEnum
}
