import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildKeyValueField,
  buildTextField,
  getValueViaPath,
  buildDescriptionField,
  buildMultiField,
  buildDividerField,
} from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
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
        id: 'overview',
        title: '',
        children: [
          buildMultiField({
            title: m.overviewSectionTitle,
            children: [
              buildDescriptionField({
                id: 'overViewDescription',
                title: m.overviewDescription,
                titleVariant: 'h5',
                marginBottom: 'none'
              }),
              buildDividerField({}),
              buildDescriptionField({
                id: 'overViewStudent',
                title: m.overviewStudentTitle,
                marginBottom: 'gutter'
              }),
              buildKeyValueField({
                width: 'half',
                label: m.overviewStudentNationalId,
                value: (application: Application) => {
                  return getValueViaPath<string>(
                    application.answers,
                    'studentMentorability.studentNationalId',
                  )
                }
              }),
              buildKeyValueField({
                width: 'half',
                label: m.overviewStudentName,
                value: (application: Application) => {
                  return getValueViaPath<string>(
                    application.answers,
                    'studentMentorability.studentName',
                  )
                }
              })
            ],
          }),
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
