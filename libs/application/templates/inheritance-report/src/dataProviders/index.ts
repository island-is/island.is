export { EstateOnEntryApi } from './EstateProvider'
export { MaritalStatusApi } from './MaritalStatusProvider'
import { defineTemplateApi } from '@island.is/application/types'

export const EstateOnEntryApi = defineTemplateApi({
  action: 'syslumennOnEntry',
  shouldPersistToExternalData: true,
})
