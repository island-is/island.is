import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const getInstructorRegistrations = (): Form => {
  return buildForm({
    id: 'InstructorRegistrationsTemplate',
    title: '',
    mode: FormModes.DRAFT,
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
            title: '',
            id: 'table',
            component: 'StudentsOverview',
          }),
        ],
      }),
    ],
  })
}
