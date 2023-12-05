import {
  ApplicationTypes,
  InstitutionNationalIds,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { buildCertificateTemplate } from '../templates'

const pdfApi = defineTemplateApi({
  action: 'getCriminalRecordPDF',
  order: 0,
  externalDataId: 'criminalRecord',
  namespace: 'CriminalRecordShared',
})

export const criminalRecord = buildCertificateTemplate({
  name: 'Umsókn um skírteini',
  additionalProvider: {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the criminal record database',
    subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
  },
  getPdfApi: pdfApi,
  templateId: ApplicationTypes.NEW_TYPE_OF_APPLICATION,
  title: 'Sakavottorð',
  organizationId: InstitutionNationalIds.SYSLUMENN,
  chargeItemCodes: [ChargeItemCode.CRIMINAL_RECORD],
})
