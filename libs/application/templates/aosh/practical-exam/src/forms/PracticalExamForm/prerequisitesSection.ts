import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { externalData, shared } from '../../lib/messages'
import {
  UserProfileApi,
  IdentityApi,
  VinnueftirlitidPaymentCatalogApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  getExamCategoriesApi,
  getPostcodesApi,
} from '../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'

export const prerequisitesSection = buildSection({
  id: 'externalData',
  tabTitle: shared.application.prerequisiteTabTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: externalData.dataProvider.pageTitle,
      subTitle: externalData.dataProvider.subTitle,
      checkboxLabel: externalData.dataProvider.checkboxLabel,
      submitField: buildSubmitField({
        id: 'submit',
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
          provider: VinnueftirlitidPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: getExamCategoriesApi,
        }),
        buildDataProviderItem({
          provider: MockableVinnueftirlitidPaymentCatalogApi,
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
          provider: getPostcodesApi,
          title: externalData.ver.prereqTitle,
          subTitle: externalData.ver.prereqMessage,
        }),
      ],
    }),
  ],
})
