import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './applicationSections/sectionDataProviders'
import { sectionInformation } from './applicationSections/sectionInformation'
import { sectionDelivery } from './applicationSections/sectionDelivery'
import { sectionOverview } from './applicationSections/sectionOverview'
import { sectionPayment } from './applicationSections/sectionPayment'

export const getApplication = (): Form => {
  return buildForm({
    id: 'DrivingLicenseDuplicateDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      sectionDataProviders,
      sectionInformation,
      sectionDelivery,
      sectionOverview,
      sectionPayment,
    ],
  })
}
