import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes, UserProfileApi } from '@island.is/application/types'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: 'Gagnaöflun',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Gagnaöflun',
          checkboxLabel: 'Ég skil að ofangreinda upplýsinga verður aflað',
          dataProviders: [
            buildDataProviderItem({
              provider: undefined, // Skatturinn
              title: 'Upplýsingar úr Skattinum',
              subTitle: 'Upplýsingar úr skattinum - Upplýsingar um gjaldflokksstöðu bifreiða',
            }),
            buildDataProviderItem({
              provider: undefined, // Samgöngustofan
              title: 'Upplýsingar úr Samgöngustofunni',
              subTitle: 'Upplýsingar úr ökutækjaskrá - Upplýsingar um þínar bifreiðar og stöðu þeirra',
            }),
            buildDataProviderItem({
              provider: undefined, // Þjóðskrá
              title: 'Upplýsingar úr Þjóðskrá',
              subTitle: 'Til þess að auðvelda fyrir, sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
            }),
            buildDataProviderItem({
              provider: undefined, // Mínar síður
              title: 'Netfang og símanúmer úr þínum stillingum',
              subTitle: 'Til að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
            }),
            // buildDataProviderItem({
            //   provider: UserProfileApi,
            //   title: 'User profile',
            //   subTitle: 'User profile',
            // }),
            // Add more data providers as needed
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: 'Staðfesta',
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
