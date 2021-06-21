import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { section } from '../lib/messages'

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
          title: 'Utanaðkomandi gögn',
          dataProviders: [
            buildDataProviderItem({
              id: 'approve.data',
              type: 'TempDataProvider',
              title: 'Staðfesting á ákveðnu atriði',
              subTitle:
                'Betri lýsing á atriðinu sem er verið að sækja annarsstaðar frá',
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
      id: 'stepOne',
      title: 'section title',
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: 'name',
          description: 'Umsókn',
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
