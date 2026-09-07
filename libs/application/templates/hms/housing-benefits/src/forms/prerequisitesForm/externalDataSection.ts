import {
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
  buildSection,
} from '@island.is/application/core'
import { DefaultEvents, UserProfileApi } from '@island.is/application/types'
import {
  ChildrenCustodyInformationApiV3,
  DomicileResidentsByRentalContractsApi,
  NationalRegistryApi,
  PersonalTaxReturnApi,
  RentalAgreementsApi,
} from '../../dataProviders'
import * as m from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'conditions',
  title: m.prereqMessages.externalDataSectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prereqMessages.externalDataTitle,
      subTitle: m.prereqMessages.subTitle,
      checkboxLabel: m.prereqMessages.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryApi,
          title: m.prereqMessages.nationalRegistryTitle,
          subTitle: m.prereqMessages.nationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: ChildrenCustodyInformationApiV3,
          title: m.prereqMessages.childrenCustodyTitle,
          subTitle: m.prereqMessages.childrenCustodySubtitle,
        }),
        buildDataProviderItem({
          provider: RentalAgreementsApi,
          title: m.prereqMessages.hmsTitle,
          subTitle: m.prereqMessages.hmsSubtitle,
        }),
        buildDataProviderItem({
          provider: DomicileResidentsByRentalContractsApi,
          title: m.prereqMessages.domicileResidentsTitle,
          subTitle: m.prereqMessages.domicileResidentsSubtitle,
        }),
        buildDataProviderItem({
          provider: PersonalTaxReturnApi,
          title: m.prereqMessages.taxTitle,
          subTitle: m.prereqMessages.taxSubtitle,
        }),
      ],
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
    }),
  ],
})
