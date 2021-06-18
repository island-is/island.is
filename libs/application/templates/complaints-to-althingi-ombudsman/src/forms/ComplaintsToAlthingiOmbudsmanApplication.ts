import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
  title: 'title',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
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
  ],
})
