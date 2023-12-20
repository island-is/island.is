import {
  ApplicationTypes,
  InstitutionNationalIds,
  InstitutionTypes,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { buildCertificateTemplate } from '../templates'

const pdfApi = defineTemplateApi({
  action: 'getCriminalRecord',
  order: 1,
})

export const criminalRecord = buildCertificateTemplate({
  name: 'Umsókn um skírteini',
  additionalProvider: {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the criminal record database',
    subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
  },
  getPdfApi: pdfApi,
  pdfKey: 'getCriminalRecord.data.contentBase64',
  templateId: ApplicationTypes.CRIMINAL_RECORD,
  title: 'Sakavottorð',
  organizationId: InstitutionNationalIds.SYSLUMENN,
  institutionId: InstitutionTypes.SYSLUMENN,
  chargeItemCodes: [ChargeItemCode.CRIMINAL_RECORD],
})
