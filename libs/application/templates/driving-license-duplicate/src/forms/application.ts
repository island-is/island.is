import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './applicationSections/sectionDataProviders'
import { sectionInformation } from './applicationSections/sectionInformation'
import { sectionDelivery } from './applicationSections/sectionDelivery'
import { sectionOverview } from './applicationSections/sectionOverview'
import { sectionPayment } from './applicationSections/sectionPayment'
import { m } from '../lib/messages'
import { sectionFakeData } from './applicationSections/sectionFakeData'
import { sectionReasonForApplication } from './applicationSections/sectionReasonForApplication'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'DrivingLicenseDuplicateDraftForm',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          sectionDataProviders,
        ],
      }),
      sectionReasonForApplication,
      sectionInformation,
      sectionDelivery,
      sectionOverview,
      sectionPayment,
    ],
  })
}
