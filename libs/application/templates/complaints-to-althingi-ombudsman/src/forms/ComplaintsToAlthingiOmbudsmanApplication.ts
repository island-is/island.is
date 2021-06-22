import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ComplaineeTypes } from '../constants'
import { dataProvider, section, complainee } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: section.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approve.external.data',
          title: dataProvider.header,
          dataProviders: [
            buildDataProviderItem({
              id: 'approve.data',
              type: 'TempDataProvider',
              title: dataProvider.title,
              subTitle: dataProvider.subtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: 'Upplýsingar',
      children: [
        buildCustomField({
          id: 'informationToComplainer',
          title: section.information,
          component: 'InformationToComplainer',
        }),
        buildSubSection({
          id: 'information.aboutTheComplainer',
          title: section.informationToComplainer,
          children: [
            buildMultiField({
              id: 'informationAboutTheComplainer',
              title: 'Upplýsingar um þann sem kvartar',
              children: [
                buildTextField({
                  id: 'information.title',
                  title: 'Nafn',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'information.ssn',
                  title: 'Kennitala',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'information.address',
                  title: 'Heimili',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'information.postcode',
                  title: 'Póstnúmer',
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                }),
                buildTextField({
                  id: 'information.city',
                  title: 'Staður',
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                }),
                buildTextField({
                  id: 'information.email',
                  title: 'Netfang',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'information.phone',
                  title: 'Sími',
                  backgroundColor: 'blue',
                  required: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complaint',
      title: section.complaint,
      children: [
        buildSubSection({
          id: 'complainee',
          title: section.complainee,
          children: [
            buildMultiField({
              id: 'complainee',
              title: section.complainee,
              children: [
                buildRadioField({
                  id: 'complainee',
                  title: '',
                  options: [
                    {
                      value: ComplaineeTypes.GOVERNMENT,
                      label: complainee.labels.governmentComplaint,
                    },
                    {
                      value: ComplaineeTypes.OTHER,
                      label: complainee.labels.otherComplaint,
                    },
                  ],
                }),
                buildCustomField({
                  id: 'complaineeContitions',
                  component: 'ComplaineeConditions',
                  title: complainee.general.conditionsTitle,
                  condition: (answers) =>
                    answers.complainee === ComplaineeTypes.GOVERNMENT,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'complaineeName',
          title: section.complaineeName,
          children: [
            buildTextField({
              id: 'complaineeName',
              variant: 'textarea',
              required: true,
              title: (answers) =>
                answers.answers.complainee === ComplaineeTypes.GOVERNMENT
                  ? complainee.general.complaineeNameGovernment
                  : complainee.general.complaineeNameOther,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'stepTwo',
      title: 'section title',
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField2',
          title: 'name',
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
