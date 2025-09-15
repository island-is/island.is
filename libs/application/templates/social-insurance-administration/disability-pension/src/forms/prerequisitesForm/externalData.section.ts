import { buildExternalDataProvider, buildSubmitField, buildDataProviderItem } from "@island.is/application/core";
import { socialInsuranceAdministrationMessage as sm } from "@island.is/application/templates/social-insurance-administration-core/lib/messages";
import { DefaultEvents, UserProfileApi, IdentityApi, NationalRegistrySpouseApi, NationalRegistryUserApi } from "@island.is/application/types";
import { SocialInsuranceAdministrationWithholdingTaxApi, SocialInsuranceAdministrationCategorizedIncomeTypesApi, SocialInsuranceAdministrationEducationLevelsApi, SocialInsuranceAdministrationCountriesApi, SocialInsuranceAdministrationLanguagesApi, SocialInsuranceAdministrationMaritalStatusesApi, SocialInsuranceAdministrationLatestIncomePlan, SocialInsuranceAdministrationIncomePlanConditionsApi, SocialInsuranceAdministrationCurrenciesApi, SocialInsuranceAdministrationSelfAssessmentQuestionsApi, SocialInsuranceAdministrationResidenceApi, SocialInsuranceAdministrationEmploymentStatusesApi, SocialInsuranceAdministrationProfessionsApi, SocialInsuranceAdministrationProfessionActivitiesApi, SocialInsuranceAdministrationIsApplicantEligibleApi } from "../../dataProviders";
import * as m from '../../lib/messages'

export const externalDataSection = buildExternalDataProvider({
  id: 'approveExternalData',
  title: sm.pre.externalDataSection,
  subTitle:
    sm.pre.externalDataDescription,
  checkboxLabel:
    m.prerequisite.checkboxLabel,
  submitField: buildSubmitField({
    id: 'submit',
    placement: 'footer',
    title: sm.pre.startApplication,
    refetchApplicationAfterSubmit: true,
    actions: [
      {
        event: DefaultEvents.SUBMIT,
        name: sm.pre.startApplication,
        type: 'primary',
      },
    ],
  }),
  dataProviders: [
    buildDataProviderItem({
      title:
        m.prerequisite
          .organizationDataTitle,
      subTitle:
        m.prerequisite.organizationDataText,
    }),
    buildDataProviderItem({
      provider: UserProfileApi,
      title: m.prerequisite.myPagesTitle,
      subTitle: m.prerequisite.myPagesText,
    }),
    buildDataProviderItem({
      provider: IdentityApi,
      title: m.prerequisite.healthDataTitle,
      subTitle:
        m.prerequisite.healthDataText,
    }),
    buildDataProviderItem({
      provider: NationalRegistrySpouseApi,
      title:
        m.prerequisite.rehabilitationTitle,
      subTitle:
        m.prerequisite.rehabilitationText,
    }),
    buildDataProviderItem({
      provider: NationalRegistryUserApi,
      title: m.prerequisite.incomeTitle,
      subTitle: m.prerequisite.incomeText,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationWithholdingTaxApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationCategorizedIncomeTypesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationEducationLevelsApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationCountriesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationLanguagesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationMaritalStatusesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationLatestIncomePlan,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationIncomePlanConditionsApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationCurrenciesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationSelfAssessmentQuestionsApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationResidenceApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationEmploymentStatusesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationProfessionsApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationProfessionActivitiesApi,
    }),
    buildDataProviderItem({
      provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
    }),
  ],
})
