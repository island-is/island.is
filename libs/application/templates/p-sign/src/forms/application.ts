import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { sectionDataProviders } from './applicationSections/sectionDataProviders'
import { sectionInformation } from './applicationSections/sectionInformation'
import { sectionPhoto } from './applicationSections/sectionPhoto'
import { sectionDelivery } from './applicationSections/sectionDelivery'
import { sectionOverview } from './applicationSections/sectionOverview'

export const getApplication = (): Form => {
  return buildForm({
    id: 'PMarkApplicationDraftForm',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      sectionDataProviders,
      sectionInformation,
      sectionPhoto,
      sectionDelivery,
      sectionOverview,
    ],
  })
}
