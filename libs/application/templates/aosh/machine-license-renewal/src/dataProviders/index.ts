import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { ApiActions } from '../utils/constants'
export { IdentityApi } from '@island.is/application/types'

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})

export const MachineLicenseRightsApi = defineTemplateApi({
  action: ApiActions.getMachineLicenseRights,
  externalDataId: 'machineLicenseRights',
})

export const VinnueftirlitidPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
  },
  externalDataId: 'payment',
})

export const MockableVinnueftirlitidPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
      mockPaymentCatalog: [
        {
          performingOrgID: InstitutionNationalIds.VINNUEFTIRLITID,
          chargeType: 'string',
          chargeItemCode: ChargeItemCode.AOSH_MACHINE_LICENSE_RENEWAL,
          chargeItemName: 'Endurútgáfa vinnuvélaskírteins og nýréttindi',
          priceAmount: 8677,
        },
      ],
    },
    externalDataId: 'payment',
  })
