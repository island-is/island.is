import {
  ApplicationTypes,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { buildCertificateTemplate } from '@island.is/application/utils'

const caramelPdfApi = defineTemplateApi({
  action: 'getCaramelPDF',
  order: 0,
  externalDataId: 'criminalRecord',
  namespace: 'CriminalRecordShared',
})

export const caramelPermission = buildCertificateTemplate(
  'Karamellur',
  {
    provider: ValidateCriminalRecordApi,
    title: 'Information from the international caramel database',
    subTitle: 'Skjal sem inniheldur þín karmellu réttindi.',
  },
  caramelPdfApi,
  ApplicationTypes.CARAMEL,
  'Karamellukast',
)
