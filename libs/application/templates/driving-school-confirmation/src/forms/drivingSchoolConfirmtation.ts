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
              buildDataProviderItem({
                id: 'schoolTypes',
                type: 'SchoolTypesProvider',
                title: '',
                subTitle: '',
              }),
            ],
          }),
        ],
      }),
      buildMultiField({
        id: 'studentsInfo',
        title: m.studentInfoTitle,
        children: [
          buildTextField({
            id: 'nationalId',
            title: m.studentInfoNationalId,
            width: 'half',
            backgroundColor: 'blue',
            format: '######-####',
            required: true,
          }),
          buildTextField({
            id: 'email',
            title: m.studentInfoEmail,
            width: 'half',
            backgroundColor: 'blue',
            variant: 'email',
          }),
        ],
      }),
      buildSection({
        id: 'confirmSchoolSection',
        title: m.confirmationSectionTitle,
        children: [
          buildMultiField({
            id: 'students',
            title: m.confirmationSectionTitle,
            children: [
              buildCustomField({
                title: m.confirmationSectionTitle,
                id: 'student',
                component: 'ViewStudent',
              }),
            ],
          }),
        ],
      }),
      buildCustomField({
        id: 'schoolConfirmed',
        title: '',
        component: 'SchoolConfirmed',
      }),
    ],
  })
}
