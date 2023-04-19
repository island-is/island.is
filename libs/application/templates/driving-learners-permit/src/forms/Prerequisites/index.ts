import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { sectionRequirements } from './sectionRequirements'
import { sectionFakeData } from './sectionFakeData'
import { CanApplyForPracticePermitApi } from '../../dataProviders'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'PrerequisitesDraft',
    title: 'Skilyrði',
    mode: FormModes.IN_PROGRESS,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'intro',
        title: m.externalDataSectionTitle,
        children: [
          buildMultiField({
            title: m.introSectionTitle,
            children: [
              buildDescriptionField({
                id: 'description',
                title: m.introSectionSubTitle,
                description: m.introSectionDescription,
              }),
              buildTextField({
                id: 'intro.studentSSN',
                title: 'Kennitala nemanda',
                placeholder: 'xxxxxxxxxx',
              }),
            ],
          }),
        ],
      }),
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
              buildDataProviderItem({
                provider: CanApplyForPracticePermitApi,
                title: m.titleCanApplyForPracticePermit,
                subTitle: m.descriptionCanApplyForPracticePermit,
              }),
            ],
          }),
          sectionRequirements,
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
