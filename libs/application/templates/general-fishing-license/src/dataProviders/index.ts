import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

import { IdentityApi as IdsApi } from '@island.is/application/types'
const FISKISTOFA_NATIONAL_ID = '6608922069'

export const DepartmentOfFisheriesPaymentCatalogApi =
  PaymentCatalogApi.configure({
    params: {
      organizationId: FISKISTOFA_NATIONAL_ID,
    },
    externalDataId: 'feeInfoProvider',
  })

export const ShipRegistryApi = defineTemplateApi({
  action: 'getShips',
  externalDataId: 'directoryOfFisheries',
})

export const IdentityApi = IdsApi.configure({
  externalDataId: 'identityRegistry',
})
