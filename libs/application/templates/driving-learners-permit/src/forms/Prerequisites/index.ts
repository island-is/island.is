import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { sectionRequirements } from './sectionRequirements'
import { sectionFakeData } from './sectionFakeData'
import { sectionLookupStudent } from './sectionLookupStudent'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'PrerequisitesDraft',
    title: 'Skilyrði',
    mode: FormModes.IN_PROGRESS,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'conditions',
        title: m.externalDataSectionTitle,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: 'Utanaðkomandi gögn',
            dataProviders: [
              buildDataProviderItem({
                id: 'currentLicense',
                type: 'CurrentLicenseProvider',
                title: m.titleCurrentLicenseProvider,
                subTitle: m.descriptionCurrentLicenseProvider,
              }),
            ],
          }),
          sectionRequirements,
          sectionLookupStudent,
        ],
      }),
      buildSection({
        id: '',
        title: m.doneTitle,
        children: [],
      }),
    ],
  })
}
