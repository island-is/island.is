import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './sections/sectionDataProviders'
import { sectionInformation } from './sections/sectionInformation'
import { sectionDelivery } from './sections/sectionDelivery'
import { sectionOverview } from './sections/sectionOverview'
import { sectionPayment } from './sections/sectionPayment'
import { sectionFakeData } from './sections/sectionFakeData'
import { sectionReasonForApplication } from './sections/sectionReasonForApplication'
import { sectionSignatureAndPhoto } from './sections/sectionSignatureAndPhoto'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'DrivingLicenseDuplicateDraftForm',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'fakeData',
        title: 'Gervigögn',
        condition: () => allowFakeData,
        children: [sectionFakeData],
      }),
      sectionDataProviders,
      sectionReasonForApplication,
      sectionInformation,
      sectionSignatureAndPhoto,
      sectionDelivery,
      sectionOverview,
      sectionPayment,
    ],
  })
}
