import { buildCertificateTemplate } from '@island.is/application/utils'

import {
  ApplicationTypes,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'

const pdfApi = defineTemplateApi({
  action: 'getCriminalRecordPDF',
  order: 0,
  externalDataId: 'criminalRecord',
  namespace: 'CriminalRecordShared',
})

export const criminalRecord = buildCertificateTemplate(
  'Umsókn um skírteini',
  {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the criminal record database',
    subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
  },
  pdfApi,
  ApplicationTypes.NEW_TYPE_OF_APPLICATION,
  'Sakavottorð',
)
