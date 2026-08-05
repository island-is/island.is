import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  NationalRegistryV3SpouseApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  NationalRegistryResidenceHistoryApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationLatestIncomePlan,
} from '../../dataProviders'
import { oldAgePensionFormMessage } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: socialInsuranceAdministrationMessage.pre.externalDataSection,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      subTitle: oldAgePensionFormMessage.pre.externalDataDescription,
      checkboxLabel: socialInsuranceAdministrationMessage.pre.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title: socialInsuranceAdministrationMessage.pre.skraInformationTitle,
          subTitle: oldAgePensionFormMessage.pre.skraInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryResidenceHistoryApi,
        }),
        buildDataProviderItem({
          provider: NationalRegistryV3SpouseApi,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: socialInsuranceAdministrationMessage.pre.contactInfoTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre.contactInfoDescription,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationApplicantApi,
          title:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationDescription,
        }),
        buildDataProviderItem({
          id: 'sia.data',
          title:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationInformationTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationDataDescription,
        }),
        buildDataProviderItem({
          id: 'sia.privacy',
          title:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationPrivacyTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationPrivacyDescription,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationCurrenciesApi,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationLatestIncomePlan,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationCategorizedIncomeTypesApi,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationIncomePlanConditionsApi,
        }),
      ],
    }),
  ],
})
