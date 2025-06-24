import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { SkatturApi, VehiclesApi } from '../../dataProviders'

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
              provider: SkatturApi, // Skatturinn
              title: 'Upplýsingar frá Skattinum',
              subTitle: 'Upplýsingar frá skattinum - Upplýsingar um gjaldflokksstöðu bifreiða',
            }),
            buildDataProviderItem({
              provider: VehiclesApi, // Samgöngustofan
              title: 'Upplýsingar frá Samgöngustofu',
              subTitle: 'Upplýsingar úr ökutækjaskrá - Upplýsingar um þínar bifreiðar og stöðu þeirra',
            }),
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
