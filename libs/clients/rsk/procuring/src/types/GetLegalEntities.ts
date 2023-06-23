import { LegalEntitySearchItem } from '../../gen/fetch'

export type GetLegalEntities = Required<
  Pick<LegalEntitySearchItem, 'nationalId' | 'name'>
>[]
