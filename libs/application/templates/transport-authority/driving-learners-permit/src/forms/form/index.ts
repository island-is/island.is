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
  buildSubSection,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { format as formatNationalId } from 'kennitala'

export const getForm = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'PrerequisitesDraft',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    logo: TransportAuthorityLogo,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSectionTitle,
        children: [
          buildSubSection({
            id: 'intro',
            title: m.introTitle,
            children: [
              buildDescriptionField({
                id: 'intro.description',
                title: m.introTitle,
                description: m.introBody,
              }),
            ],
          }),
          ...(allowFakeData ? [sectionFakeData] : []),
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.externalDataSectionTitle,
            checkboxLabel: m.externalDataSectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                title: m.titleNationalRegistryProvider,
                subTitle: m.descriptionNationalRegistryProvider,
              }),
              buildDataProviderItem({
                id: 'personalInfo',
                title: m.titlePersonalInfoProvider,
                subTitle: m.descriptionPersonalInfoProvider,
              }),
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
