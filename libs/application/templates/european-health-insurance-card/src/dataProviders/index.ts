import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from './apiActions.enum'

export const EhicCardResponseApi = defineTemplateApi({
  action: ApiActions.getCardResponse,
  externalDataId: 'cardResponse',
  order: 2,
})

export const EhicGetTemporaryCardApi = defineTemplateApi({
  action: ApiActions.getTemporaryCard,
  externalDataId: 'getTemporaryCardResponse',
})

export const EhicApplyForPhysicalAndTemporary = defineTemplateApi({
  action: ApiActions.applyForPhysicalAndTemporary,
  externalDataId: 'applyForCardsResponse',
  shouldPersistToExternalData: true,
  throwOnError: true,
})
