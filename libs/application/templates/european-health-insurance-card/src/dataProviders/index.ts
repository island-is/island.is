import { defineTemplateApi } from '@island.is/application/types'

export const EhicCardResponseApi = defineTemplateApi({
  action: 'getCardResponse',
  externalDataId: 'cardResponse',
  order: 2,
})

export const EhicApplyForPhysicalCardApi = defineTemplateApi({
  action: 'applyForPhysicalCard',
  externalDataId: 'applyForPhysicalCardResponse',
})

export const EhicApplyForTemporaryCardApi = defineTemplateApi({
  action: 'applyForTemporaryCard',
  externalDataId: 'applyForTemporaryCardResponse',
})

export const EhicGetTemporaryCardApi = defineTemplateApi({
  action: 'getTemporaryCard',
  externalDataId: 'getTemporaryCardResponse',
})

export const EhicResendPhysicalCardApi = defineTemplateApi({
  action: 'resendPhysicalCard',
  externalDataId: 'resendPhysicalCardResponse',
})
