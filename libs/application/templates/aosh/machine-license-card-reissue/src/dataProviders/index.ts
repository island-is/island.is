import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { ApiActions } from '../shared'
export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const LicensesApi = defineTemplateApi({
  action: ApiActions.getLicenses,
  externalDataId: 'licenses',
})

export const VinnueftirlitidPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
  },
  externalDataId: 'payment',
})

export const MockableVinnueftirlitidPaymentCatalogApi = MockablePaymentCatalogApi.configure(
  {
    params: {
      organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
      enableMockPayment: true,
      mockPaymentCatalog: [
        {
          performingOrgID: InstitutionNationalIds.VINNUEFTIRLITID,
          chargeType: 'string',
          chargeItemCode: ChargeItemCode.AOSH_MACHINE_LICENSE_CARD_REISSUE,
          chargeItemName: 'Endurnýjun réttinda',
          priceAmount: 8470,
        },
      ],
    },
    externalDataId: 'payment',
  },
)
