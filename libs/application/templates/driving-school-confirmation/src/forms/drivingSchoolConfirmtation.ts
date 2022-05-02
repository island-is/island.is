import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildTextField,
  buildSubmitField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const getDrivingSchoolConfirmation = (): Form => {
  return buildForm({
    id: 'getDrivingSchoolConfirmation',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
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
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                id: 'employee',
                type: 'EmployeeProvider',
                title: m.dataCollectionConfirmationRightsTitle,
                subTitle: m.dataCollectionConfirmationRightsSubtitle,
              }),
            ],
          }),
        ],
      }),
      buildMultiField({
        id: 'studentsInfo',
        title: m.studentInfoTitle,
        children: [
          buildCustomField({
            title: '',
            id: 'student',
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
                title: '',
                id: 'info',
                component: 'ViewStudent',
              }),
              buildCustomField({
                title: '',
                id: 'confirmation.date',
                component: 'ConfirmationDate',
                condition: (answers) => !!answers.studentBookTypes,
              }),
              buildCustomField({
                title: '',
                id: 'confirmation.school',
                component: 'SelectSchool',
                condition: (answers) => !!answers.studentBookTypes,
              }),
              buildSubmitField({
                id: 'submit',
                title: '',
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
