import { defineTemplateApi } from '@island.is/application/types'

export const EhicCardResponseApi = defineTemplateApi({
  action: 'getCardResponse',
  externalDataId: 'cardResponse',
  order: 2,
})

export const EhicApplyForPhysicalCardApi = defineTemplateApi({
  action: 'applyForPhysicalCard',
  externalDataId: 'applyForPhysicalCardResponse',
  order: 0,
})

export const EhicApplyForTemporaryCardApi = defineTemplateApi({
  action: 'applyForTemporaryCard',
  externalDataId: 'applyForTemporaryCardResponse',
  order: 1,
})

export const EhicGetTemporaryCardApi = defineTemplateApi({
  action: 'getTemporaryCard',
  externalDataId: 'getTemporaryCardResponse',
})

export const EhicResendPhysicalCardApi = defineTemplateApi({
  action: 'resendPhysicalCard',
  externalDataId: 'resendPhysicalCardResponse',
})

export const EhicApplyForPhysicalAndTemporary = defineTemplateApi({
  action: 'applyForPhysicalAndTemporary',
  externalDataId: 'applyForPhysicalAndTemporaryResponse',
})
