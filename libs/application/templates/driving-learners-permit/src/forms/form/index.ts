import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildKeyValueField,
  getValueViaPath,
  buildDescriptionField,
  buildMultiField,
  buildDividerField,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { format as formatNationalId } from 'kennitala'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'PrerequisitesDraft',
    title: '',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSectionTitle,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.externalDataSectionTitle,
            checkboxLabel: m.externalDataSectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'currentLicense',
                type: 'CurrentLicenseProvider',
                title: m.titleCurrentLicenseProvider,
                subTitle: m.descriptionCurrentLicenseProvider,
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'instructorRequirements',
        title: m.applicationEligibilityTitle,
        children: [
          buildMultiField({
            id: 'info',
            title: m.applicationEligibilityTitle,
            description: m.applicationEligibilityRequirementDescription,
            children: [
              buildCustomField({
                title: m.applicationEligibilityTitle,
                component: 'EligibilitySummary',
                id: 'eligsummary',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'studentMentorability',
        title: m.applicationStudentRequirementsTitle,
        children: [
          buildMultiField({
            id: 'studentMentorability',
            title: m.applicationStudentLookupTitle,
            description: m.studentInfoHeading,
            children: [
              buildCustomField({
                title: m.applicationStudentLookupTitle,
                component: 'LookupStudent',
                id: 'studentMentorability',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'overview',
        title: m.overviewSectionTitle,
        children: [
          buildMultiField({
            title: m.overviewSectionTitle,
            description: m.overviewDescription,
            children: [
              buildDividerField({}),
              buildDescriptionField({
                id: 'overview',
                title: m.overviewStudentTitle,
                titleVariant: 'h3',
                marginBottom: 'gutter',
                space: 'gutter',
              }),
              buildKeyValueField({
                width: 'half',
                label: m.overviewStudentNationalId,
                value: (application: Application) => {
                  const nationalId =
                    getValueViaPath<string>(
                      application.answers,
                      'studentMentorability.studentNationalId',
                    ) ?? ''
                  return formatNationalId(nationalId)
                },
              }),
              buildKeyValueField({
                width: 'half',
                label: m.overviewStudentName,
                value: (application: Application) => {
                  return getValueViaPath<string>(
                    application.answers,
                    'studentMentorability.studentName',
                  )
                },
              }),
              buildSubmitField({
                id: 'overview.submit',
                title: '',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.overviewSubmitButton,
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
