import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './applicationSections/sectionDataProviders'
import { sectionInformation } from './applicationSections/sectionInformation'
import { sectionDelivery } from './applicationSections/sectionDelivery'
import { sectionOverview } from './applicationSections/sectionOverview'
import { sectionPayment } from './applicationSections/sectionPayment'
import { sectionFakeData } from './applicationSections/sectionFakeData'
import { sectionReasonForApplication } from './applicationSections/sectionReasonForApplication'
import { sectionDigitalLicenseInfo } from './applicationSections/sectionDigitalLicenseInfo'
import { sectionSignatureAndPhoto } from './applicationSections/sectionSignatureAndPhoto'

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
      sectionDigitalLicenseInfo,
      sectionDelivery,
      sectionOverview,
      sectionPayment,
    ],
  })
}
