import {
  defineTemplateApi,
  PaymentCatalogApi,
  InstitutionNationalIds,
} from '@island.is/application/types'

import { IdentityApi as IdsApi } from '@island.is/application/types'

export const DepartmentOfFisheriesPaymentCatalogApi =
  PaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.FISKISTOFA,
      enableMockPayment: false,
    },
    externalDataId: 'feeInfoProvider',
  })

export const ShipRegistryApi = defineTemplateApi({
  action: 'getShips',
  externalDataId: 'directoryOfFisheries',
})

export const IdentityApi = IdsApi.configure({
  externalDataId: 'identity',
})

export {
  MockPaymentCatalog as MockablePaymentCatalogApi,
  MockPaymentCatalog,
} from './mockPaymentCatalog'
