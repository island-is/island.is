import { defineTemplateApi } from '@island.is/application/types'

export const NoDebtCertificateApi = defineTemplateApi({
  action: 'getDebtLessCertificate',
  externalDataId: 'noDebtCertificate',
})
