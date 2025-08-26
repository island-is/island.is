import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import {
  UserProfileApi,
  IdentityApi,
  VinnueftirlitidPaymentCatalogApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  getSeminarsApi,
  getIndividualValidityApi,
} from '../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'

export const prerequisitesSection = buildSection({
  id: 'externalData',
  title: '',
  tabTitle: externalData.dataProvider.tabTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: externalData.dataProvider.pageTitle,
      subTitle: externalData.dataProvider.subTitle,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        title: '',
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
          provider: VinnueftirlitidPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: MockableVinnueftirlitidPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: getSeminarsApi,
        }),
        buildDataProviderItem({
          provider: getIndividualValidityApi,
        }),
        buildDataProviderItem({
          provider: IdentityApi,
          title: externalData.nationalRegistry.title,
          subTitle: externalData.nationalRegistry.subTitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: externalData.userProfile.title,
          subTitle: externalData.userProfile.subTitle,
        }),
        buildDataProviderItem({
          title: externalData.ver.title,
          subTitle: externalData.ver.subTitle,
        }),
      ],
    }),
  ],
})
