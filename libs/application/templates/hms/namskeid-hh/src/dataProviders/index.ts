import {
  defineTemplateApi,
  IdentityApi as IdentityApiType,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const IdentityApi = IdentityApiType.configure({
  //params: { includeActorInfo: true },
})

export const HMSPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
  },
  externalDataId: 'payment',
})

export const MockableHMSPaymentCatalogApi = MockablePaymentCatalogApi.configure(
  {
    params: {
      organizationId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
      enableMockPayment: true,
      mockPaymentCatalog: [
        {
          performingOrgID:
            InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
          chargeType: 'FB2',
          chargeItemCode: ChargeItemCode.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
          chargeItemName: 'Námskeið HH',
          priceAmount: 32500,
        },
      ],
    },
    externalDataId: 'payment',
  },
)

