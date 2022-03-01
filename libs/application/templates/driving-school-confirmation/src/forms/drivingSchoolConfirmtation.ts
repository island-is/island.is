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
            ],
          }),
        ],
      }),
      buildMultiField({
        id: 'studentsInfo',
        title: 'Upplýsingar um ökunema',
        children: [
          buildTextField({
            id: 'nationalId',
            title: 'Kennitala umsækjanda',
            width: 'half',
            backgroundColor: 'white',
          }),
          buildTextField({
            id: 'email',
            title: 'Netfang umsækjanda',
            width: 'half',
            backgroundColor: 'white',
          }),
        ],
      }),
      buildSection({
        id: 'confirmSchoolSection',
        title: 'Staðfesta áfanga',
        children: [
          buildMultiField({
            id: 'students',
            title: 'Staðfesta ökuskóla',
            children: [
              buildCustomField({
                title: 'Staðfesta ökuskóla',
                id: 'student',
                component: 'ViewStudent',
              }),
            ],
          }),
        ],
      }),
      buildCustomField({
        id: 'listSubmitted',
        title: '',
        component: 'ListSubmitted',
      }),
    ],
  })
}
