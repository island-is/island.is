import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export interface NoDebtCertificateApiParameters {
  language: string
}

export const NoDebtCertificateApi = defineTemplateApi<NoDebtCertificateApiParameters>(
  {
    action: 'getDebtLessCertificate',
    externalDataId: 'noDebtCertificate',
    params: {
      language: 'IS', //TODOx send in locale
    },
  },
)
