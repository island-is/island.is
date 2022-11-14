import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../lib/constants'

export { VeitaProvider } from './VeitaProvider'
export { NationalRegistryProvider } from './NationalRegistryProvider'
export { TaxDataFetchProvider } from './TaxDataFetchProvider'

export const CurrentApplicationApi = defineTemplateApi({
  action: ApiActions.CURRENTAPPLICATION,
  externalDataId: 'veita',
})

export const CreateApplicationApi = defineTemplateApi({
  action: ApiActions.CREATEAPPLICATION,
  shouldPersistToExternalData: true,
  externalDataId: 'veita',
})
