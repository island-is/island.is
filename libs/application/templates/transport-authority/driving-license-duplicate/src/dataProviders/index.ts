import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
  PhotoLookupCheckApi,
  defineTemplateApi,
} from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const MockableSyslumadurPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'payment',
  })

export const DuplicateEligibilityApi = defineTemplateApi({
  action: 'canGetNewDuplicate',
  shouldPersistToExternalData: false,
})

export const DuplicatePhotoLookupCheckApi = PhotoLookupCheckApi.configure({
  params: {
    rlsPhotoSource: 'qualityPhoto',
  },
})
