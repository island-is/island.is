import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  GetTeacherRightsApi,
  HasTeachingRightsApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'

export const getInstructorRegistrations = (allowBELicense = false): Form => {
  return buildForm({
    id: 'InstructorRegistrationsTemplate',
    mode: FormModes.DRAFT,
    renderLastScreenButton: false,
    logo: TransportAuthorityLogo,
    children: [
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
            subTitle: m.dataCollectionSubtitle,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                provider: HasTeachingRightsApi,
                title: m.dataCollectionTeachersRightsTitle,
                subTitle: m.dataCollectionTeachersRightsSubtitle,
              }),
              buildDataProviderItem({
                provider: NationalRegistryUserApi,
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                provider: allowBELicense ? GetTeacherRightsApi : undefined,
                title: '',
                subTitle: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'students',
        title: m.studentsOverviewSideTitle,
        children: [
          buildCustomField(
            {
              title: '',
              id: 'table',
              component: 'StudentsOverview',
            },
            {
              allowBELicense: allowBELicense,
            },
          ),
        ],
      }),
    ],
  })
}
