import {
  ApplicationTemplate,
  ApplicationTypes,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { buildCertificateTemplate } from '../template.model'

const pdfApi = defineTemplateApi({
  action: 'getCriminalRecordPDF',
  order: 0,
  externalDataId: 'criminalRecord',
  namespace: 'CriminalRecordShared',
})

const caramelPdfApi = defineTemplateApi({
  action: 'getCaramelPDF',
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
)

export const caramelPermission = buildCertificateTemplate(
  'Karamellur',
  {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the criminal record database',
    subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
  },
  caramelPdfApi,
  ApplicationTypes.CARAMEL,
)

export const CertificateTemplateMapper: Partial<
  Record<ApplicationTypes, ApplicationTemplate<any, any, any>>
> = {
  [ApplicationTypes.NEW_TYPE_OF_APPLICATION]: criminalRecord,
  [ApplicationTypes.CARAMEL]: caramelPermission,
}
