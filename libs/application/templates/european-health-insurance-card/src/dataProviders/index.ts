import { defineTemplateApi } from '@island.is/application/types'

export const EhicCardResponseApi = defineTemplateApi({
  action: 'getCardResponse',
  externalDataId: 'cardResponse',
  order: 2,
})

export const EhicGetTemporaryCardApi = defineTemplateApi({
  action: 'getTemporaryCard',
  externalDataId: 'getTemporaryCardResponse',
})

export const EhicApplyForPhysicalAndTemporary = defineTemplateApi({
  action: 'applyForPhysicalAndTemporary',
  externalDataId: 'applyForCardsResponse',
})
