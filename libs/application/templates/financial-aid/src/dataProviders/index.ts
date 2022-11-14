import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../lib/constants'

export { VeitaProvider } from './VeitaProvider'
export { NationalRegistryProvider } from './NationalRegistryProvider'
export { TaxDataFetchProvider } from './TaxDataFetchProvider'

export interface TestActionParam {
  message: string
}

export const TestActionApi = defineTemplateApi<TestActionParam>({
  action: ApiActions.TESTACTION,
  params: {
    message: 'wooooooowwwwwww',
  },
})

export const CreateApplicationApi = defineTemplateApi({
  action: ApiActions.CREATEAPPLICATION,
  shouldPersistToExternalData: true,
  externalDataId: 'veita',
})
