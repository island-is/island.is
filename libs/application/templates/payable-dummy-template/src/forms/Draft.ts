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
  getValueViaPath,
} from '@island.is/application/core'

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
              type: 'FeeInfoProvider',
              title: 'Upplýsingar um kostnað',
              subTitle: 'Upplýsingar um kostnað hjá Fjársýslunni',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: 'Upplýsingar',
      children: [
        buildMultiField({
          id: 'externalDataSuccess',
          title: 'Æði',
          children: [
            buildSubmitField({
              id: 'toDraft',
              placement: 'footer',
              title: 'Umsókn um greislu',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Áfram',
                  type: 'primary',
                },
              ],
            }),
            buildKeyValueField({
              label: 'Kennitala stofnunar',
              width: 'half',
              value: (application: Application) => {
                return get(
                  application.externalData,
                  'paymentCatalogProvider.data.performingOrgID',
                  'Fannst ekki',
                ) as string
              },
            }),
            buildKeyValueField({
              label: 'Upphæð',
              width: 'half',
              value: (application: Application) => {
                const priceAmount = getValueViaPath(
                  application.externalData,
                  'paymentCatalogProvider.data.priceAmount',
                ) as number

                // todo: get price formatting function from utils somewhere
                return priceAmount.toLocaleString('DE-de')
              },
            }),
            buildKeyValueField({
              label: 'Tegund gjalds',
              width: 'half',
              value: (application: Application) => {
                console.log(application.externalData)
                return (
                  ((get(
                    application.externalData,
                    'paymentCatalogProvider.data.chargeItemCode',
                    'Fannst ekki',
                  ) +
                    ' (' +
                    get(
                      application.externalData,
                      'paymentCatalogProvider.data.chargeItemName',
                      'Fannst ekki',
                    )) as string) + ')'
                )
              },
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
