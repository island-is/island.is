import { defineTemplateApi } from '@island.is/application/types'
export { MaritalStatusApi } from './MaritalStatusProvider'

export const EstateOnEntryApi = defineTemplateApi({
  action: 'syslumennOnEntry',
  shouldPersistToExternalData: true,
})
