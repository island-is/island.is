import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { coreMessages } from '@island.is/application/core/messages'
import { UserProfileApi, NationalRegistryV3UserApi } from '../../dataProviders'
import * as m from '../../lib/messages'

export const externalData = buildSection({
  id: 'externalData',
  title: m.prerequisites.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prerequisites.externalData.pageTitle,
      subTitle: m.prerequisites.externalData.subTitle,
      checkboxLabel: m.prerequisites.externalData.checkboxLabel,
      submitField: buildSubmitField({
        id: 'toDraft',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: coreMessages.buttonNext,
            type: 'primary',
          },
        ],
      }),
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prerequisites.externalData.currentApplicationTitle,
          subTitle: m.prerequisites.externalData.currentApplicationSubTitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title: m.prerequisites.externalData.nationalRegistryTitle,
          subTitle: m.prerequisites.externalData.nationalRegistrySubTitle,
        }),
      ],
    }),
  ],
})
