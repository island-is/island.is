import {
  ApplicationTypes,
  InstitutionNationalIds,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'

import { ChargeItemCode } from '@island.is/shared/constants'
import { buildCertificateTemplate } from '../templates'

const caramelPdfApi = defineTemplateApi({
  action: 'getCaramelPDF',
  order: 0,
  externalDataId: 'criminalRecord',
  namespace: 'CriminalRecordShared',
})

export const caramelPermission = buildCertificateTemplate({
  name: 'Karamellur',
  additionalProvider: {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the international caramel database',
    subTitle: 'Skjal sem inniheldur þín karmellu réttindi.',
  },
  getPdfApi: caramelPdfApi,
  templateId: ApplicationTypes.CARAMEL,
  title: 'Karamellukast',
  organizationId: InstitutionNationalIds.SYSLUMENN,
  chargeItemCodes: [ChargeItemCode.CRIMINAL_RECORD],
})
