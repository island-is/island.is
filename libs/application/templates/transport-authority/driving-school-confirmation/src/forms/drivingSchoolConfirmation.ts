import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  DefaultEvents,
  EmployeeApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'

export const getDrivingSchoolConfirmation = (): Form => {
  return buildForm({
    id: 'getDrivingSchoolConfirmation',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
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
                provider: NationalRegistryUserApi,
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                provider: EmployeeApi,
                title: m.dataCollectionConfirmationRightsTitle,
                subTitle: m.dataCollectionConfirmationRightsSubtitle,
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'studentsInfoSection',
        title: m.studentInfoTitle,
        children: [
          buildCustomField({
            id: 'student',
            title: m.studentInfoTitle,
            component: 'NationalIdwithName',
          }),
        ],
      }),
      buildSection({
        id: 'confirmSchoolSection',
        title: m.confirmationSectionTitle,
        children: [
          buildMultiField({
            id: 'student',
            title: m.confirmationSectionTitle,
            children: [
              buildCustomField({
                id: 'info',
                component: 'ViewStudent',
              }),
              buildCustomField({
                id: 'confirmation.date',
                component: 'ConfirmationDate',
                condition: (answers) => !!answers.studentBookTypes,
              }),
              buildCustomField({
                id: 'confirmation.school',
                component: 'SelectSchool',
                condition: (answers) => !!answers.studentBookTypes,
              }),
              buildSubmitField({
                id: 'submit',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.confirmSchoolButton,
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
