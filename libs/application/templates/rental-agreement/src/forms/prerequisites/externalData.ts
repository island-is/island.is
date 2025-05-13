import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { UserProfileApi, NationalRegistryUserApi } from '../../dataProviders'
import { prerequisites } from '../../lib/messages'

export const externalData = buildSection({
  id: 'externalData',
  title: prerequisites.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisites.externalData.pageTitle,
      subTitle: prerequisites.externalData.subTitle,
      checkboxLabel: prerequisites.externalData.checkboxLabel,
      submitField: buildSubmitField({
        id: 'toDraft',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: prerequisites.externalData.submitButton,
            type: 'primary',
          },
        ],
      }),
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: prerequisites.externalData.currentApplicationTitle,
          subTitle: prerequisites.externalData.currentApplicationSubTitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: prerequisites.externalData.nationalRegistryTitle,
          subTitle: prerequisites.externalData.nationalRegistrySubTitle,
        }),
      ],
    }),
  ],
})
