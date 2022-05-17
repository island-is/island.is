import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { getTitle } from '../lib/utils'

export const getInstructorRegistrations = (): Form => {
  return buildForm({
    id: 'InstructorRegistrationsTemplate',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: false,
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
                id: 'teachingRights',
                type: 'TeachingRightsProvider',
                title: m.dataCollectionTeachersRightsTitle,
                subTitle: m.dataCollectionTeachersRightsSubtitle,
              }),
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
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
          buildCustomField({
            title: getTitle,
            id: 'table',
            component: 'StudentsOverview',
          }),
        ],
      }),
    ],
  })
}
