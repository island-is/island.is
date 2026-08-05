import { defineTemplateApi } from '@island.is/application/types'

export const SubmitDocumentsEligibilityApi = defineTemplateApi({
  action: 'checkEligibility',
  externalDataId: 'submitDocumentsEligibility',
})

export const GetAttachmentTypesApi = defineTemplateApi({
  action: 'getAttachmentTypes',
  externalDataId: 'attachmentTypes',
})

export const GetRequestedAttachments = defineTemplateApi({
  action: 'getRequestedAttachments',
  externalDataId: 'requestedAttachments',
})
