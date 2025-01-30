import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'
import {
  IdentityApi,
  UserProfileApi,
  MachinesApi,
  MustInspectBeforeRegistrationApi,
  VinnueftirlitidPaymentCatalogApi,
  GetAvailableRegistrationTypes,
} from '../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'

export const prerequisitesSection = buildSection({
  id: 'externalData',
  title: externalData.dataProvider.sectionTitle,
  children: [
    buildExternalDataProvider({
      title: externalData.dataProvider.pageTitle,
      id: 'approveExternalData',
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
          provider: MachinesApi,
          title: externalData.myMachines.title,
          subTitle: externalData.myMachines.subTitle,
        }),
        buildDataProviderItem({
          provider: MustInspectBeforeRegistrationApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: GetAvailableRegistrationTypes,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: VinnueftirlitidPaymentCatalogApi,
          title: '',
        }),
      ],
    }),
  ],
})
