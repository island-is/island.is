import { defineTemplateApi } from '@island.is/application/types'

export const EstateOnEntryApi = defineTemplateApi({
  action: 'syslumennOnEntry',
  shouldPersistToExternalData: true,
})

export const MaritalStatusApi = defineTemplateApi({
  action: 'maritalStatus',
  shouldPersistToExternalData: true,
})

export const SubmitToSyslumennApi = defineTemplateApi({
  action: 'submitToSyslumenn',
  shouldPersistToExternalData: true,
})

export const GetSignatoriesApi = defineTemplateApi({
  action: 'getSignatories',
  shouldPersistToExternalData: true,
  externalDataId: 'getSignatories',
})
