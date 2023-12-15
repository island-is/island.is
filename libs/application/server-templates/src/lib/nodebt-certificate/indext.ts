import {
  ApplicationTypes,
  InstitutionNationalIds,
  InstitutionTypes,
  defineTemplateApi,
} from '@island.is/application/types'
import { buildCertificateTemplateNoPayment } from '../templates/certificates/template'
import { m } from './messages'

const pdfApi = defineTemplateApi({
  action: 'getDebtLessCertificate',
  externalDataId: 'noDebtCertificate',
  order: 1,
})

export const noDebtCertificate = buildCertificateTemplateNoPayment({
  name: m.name,
  additionalProvider: {
    title: m.noDebtCertificateInformationTitle,
    subTitle: m.noDebtCertificateInformationSubTitle,
  },
  getPdfApi: pdfApi,
  pdfKey:
    'noDebtCertificate.data.debtLessCertificateResult.certificate.document',
  templateId: ApplicationTypes.NO_DEBT_CERTIFICATE,
  institutionId: InstitutionTypes.SYSLUMENN,
  title: 'Skuldleysisvottord',
  organizationId: InstitutionNationalIds.SYSLUMENN,
})
