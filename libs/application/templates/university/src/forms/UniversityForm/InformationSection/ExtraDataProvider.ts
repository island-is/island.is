import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { externalData, information } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { NationalRegistryIndividualApi } from '../../../dataProviders'

export const ExtraDataProviderSubSection = buildSubSection({
  id: 'extraDataProvider',
  title: information.labels.extraDataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: 'TODO',
      id: 'extraDataProvider.approveExternalData',
      subTitle: externalData.dataProvider.subTitle,
      description: externalData.dataProvider.description,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        title: '',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: information.labels.extraDataProvider.submitButton,
            type: 'primary',
          },
        ],
      }),
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryIndividualApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.subTitle,
        }),
      ],
    }),
  ],
})
