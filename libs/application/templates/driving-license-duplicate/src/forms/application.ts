import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './sections/sectionDataProviders'
import { sectionInformation } from './sections/sectionInformation'
import { sectionDelivery } from './sections/sectionDelivery'
import { sectionOverview } from './sections/sectionOverview'
import { sectionPayment } from './sections/sectionPayment'
import { sectionFakeData } from './sections/sectionFakeData'
import { sectionReasonForApplication } from './sections/sectionReasonForApplication'
import { sectionPhoto } from './sections/sectionPhoto'

export const getApplication = ({
  allowFakeData = false,
  allowThjodskraPhotos = false,
}): Form => {
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
      sectionDataProviders(allowFakeData, allowThjodskraPhotos),
      sectionReasonForApplication,
      sectionInformation,
      sectionPhoto,
      sectionDelivery,
      sectionOverview,
      sectionPayment,
    ],
  })
}
