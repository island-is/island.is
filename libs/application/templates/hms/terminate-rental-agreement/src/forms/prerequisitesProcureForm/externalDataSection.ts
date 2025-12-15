import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  DefaultEvents,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'
import { rentalAgreementsApi } from '../../dataProviders'

export const externalDataSection = buildSection({
  id: 'externalDataProcure',
  tabTitle: m.prereqMessages.title,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prereqMessages.title,
      subTitle: m.prereqMessages.subTitle,
      checkboxLabel: m.prereqMessages.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileDescription,
        }),
        buildDataProviderItem({
          provider: IdentityApi,
          title: m.prereqMessages.companyRegistryTitle,
          subTitle: m.prereqMessages.nationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: rentalAgreementsApi,
          title: m.prereqMessages.housingBenefitsTitle,
          subTitle: m.prereqMessages.housingBenefitsDescription,
        }),
      ],
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
    }),
  ],
})
