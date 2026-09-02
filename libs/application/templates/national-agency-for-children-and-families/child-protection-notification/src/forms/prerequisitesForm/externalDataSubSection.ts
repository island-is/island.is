import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  CategoriesApi,
  ChildSafetyLevelsApi,
  ChildUnknownNationalIdStatesApi,
  DisabilityStatusesApi,
  GendersApi,
  GuardianNotAwareReasonsApi,
  IdentityApiProvider,
  NationalRegistryV3UserApi,
  NotifierRolesApi,
  NotifierRoleSubTypesApi,
  PostalCodesApi,
  PronounsApi,
  ProtectiveFactorsApi,
  SchoolTypesApi,
} from '../../dataProviders'
import { prerequisitesMessages } from '../../lib/messages'

export const personalExternalDataSubSection = buildSubSection({
  id: 'personalExternalDataSubSection',
  title: prerequisitesMessages.externalData.subSectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisitesMessages.externalData.subSectionTitle,
      subTitle: prerequisitesMessages.externalData.description,
      checkboxLabel: prerequisitesMessages.externalData.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title:
            prerequisitesMessages.externalData.nationalRegistryInformationTitle,
          subTitle:
            prerequisitesMessages.externalData
              .personalNationalRegistryInformationSubTitle,
        }),
      ],
      // TODO: Remove submitField when personal application is implemented
      submitField: buildSubmitField({
        id: 'submit',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: prerequisitesMessages.child.startNotification,
            type: 'primary',
          },
        ],
      }),
    }),
  ],
})

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: prerequisitesMessages.externalData.subSectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisitesMessages.externalData.subSectionTitle,
      subTitle: prerequisitesMessages.externalData.description,
      checkboxLabel: prerequisitesMessages.externalData.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: IdentityApiProvider,
          title:
            prerequisitesMessages.externalData.nationalRegistryInformationTitle,
          subTitle:
            prerequisitesMessages.externalData
              .nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: CategoriesApi,
        }),
        buildDataProviderItem({
          provider: ProtectiveFactorsApi,
        }),
        buildDataProviderItem({
          provider: GendersApi,
        }),
        buildDataProviderItem({
          provider: ChildSafetyLevelsApi,
        }),
        buildDataProviderItem({
          provider: PronounsApi,
        }),
        buildDataProviderItem({
          provider: DisabilityStatusesApi,
        }),
        buildDataProviderItem({
          provider: PostalCodesApi,
        }),
        buildDataProviderItem({
          provider: ChildUnknownNationalIdStatesApi,
        }),
        buildDataProviderItem({
          provider: GuardianNotAwareReasonsApi,
        }),
        buildDataProviderItem({
          provider: SchoolTypesApi,
        }),
        buildDataProviderItem({
          provider: NotifierRolesApi,
        }),
        buildDataProviderItem({
          provider: NotifierRoleSubTypesApi,
        }),
      ],
    }),
  ],
})
