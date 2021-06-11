import get from 'lodash/get'
import {
  Application,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildKeyValueField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const Draft: Form = buildForm({
  id: 'Draft',
  title: 'Borga',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: 'Borga',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Utanaðkomandi gögn',
          dataProviders: [
            buildDataProviderItem({
              id: 'paymentCatalogProvider',
              type: 'PaymentCatalogProvider',
              title: 'Upplýsingar um kostnað',
              subTitle: 'Upplýsingar um kostnað hjá Fjársýslunni'
            }),
          ],
        }),
      ]
    }),
    buildSection({
      id: 'conditions',
      title: 'Upplýsingar',
      children: [
        buildMultiField({
          id: 'externalDataSuccess',
          title: 'Æði',
          children: [
            buildKeyValueField({
              label: 'Kennitala stofnunar',
              width: 'half',
              value: (application: Application) => {
                return get(application.externalData, 'paymentCatalogProvider.data.performingOrgID', 'Fannst ekki') as string
              },
            }),
            buildKeyValueField({
              label: 'Upphæð',
              width: 'half',
              value: (application: Application) => {
                return get(application.externalData, 'paymentCatalogProvider.data.priceAmount', 'Fannst ekki') as string
              },
            }),
            buildKeyValueField({
              label: 'Tegund gjalds',
              width: 'half',
              value: (application: Application) => {
                console.log(application.externalData)
                return get(application.externalData, 'paymentCatalogProvider.data.chargeItemCode', 'Fannst ekki') + ' (' +
                  get(application.externalData, 'paymentCatalogProvider.data.chargeItemName', 'Fannst ekki') as string + ')'
              },
            }),
            buildSubmitField({
              id: 'toDraft',
              placement: 'footer',
              title: 'Æði æði æði, ennþá meiri gæði',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Áfram',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'neverDisplayed',
          title: 'Greiðsla',
          description: '',
        }),
      ],
    }),
  ],
})
