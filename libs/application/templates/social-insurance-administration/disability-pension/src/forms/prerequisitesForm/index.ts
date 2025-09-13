import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  DefaultEvents,
  FormModes,
  IdentityApi,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationEducationLevelsApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationWithholdingTaxApi,
  SocialInsuranceAdministrationCountriesApi,
  SocialInsuranceAdministrationSelfAssessmentQuestionsApi,
  SocialInsuranceAdministrationLanguagesApi,
  SocialInsuranceAdministrationMaritalStatusesApi,
  SocialInsuranceAdministrationResidenceApi,
  SocialInsuranceAdministrationEmploymentStatusesApi,
  SocialInsuranceAdministrationProfessionsApi,
  SocialInsuranceAdministrationProfessionActivitiesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../../dataProviders'
import { disabilityPensionFormMessage } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'disabilityPensionPrerequisites',
  title: disabilityPensionFormMessage.shared.title,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'prerequisites',
      title: disabilityPensionFormMessage.prerequisites.title,
      tabTitle: disabilityPensionFormMessage.prerequisites.title,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: socialInsuranceAdministrationMessage.pre.externalDataSection,
          subTitle:
            socialInsuranceAdministrationMessage.pre.externalDataDescription,
          checkboxLabel:
            disabilityPensionFormMessage.prerequisites.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: socialInsuranceAdministrationMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: socialInsuranceAdministrationMessage.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              title:
                disabilityPensionFormMessage.prerequisites
                  .organizationDataTitle,
              subTitle:
                disabilityPensionFormMessage.prerequisites.organizationDataText,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: disabilityPensionFormMessage.prerequisites.myPagesTitle,
              subTitle: disabilityPensionFormMessage.prerequisites.myPagesText,
            }),
            buildDataProviderItem({
              provider: IdentityApi,
              title: disabilityPensionFormMessage.prerequisites.healthDataTitle,
              subTitle:
                disabilityPensionFormMessage.prerequisites.healthDataText,
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title:
                disabilityPensionFormMessage.prerequisites.rehabilitationTitle,
              subTitle:
                disabilityPensionFormMessage.prerequisites.rehabilitationText,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: disabilityPensionFormMessage.prerequisites.incomeTitle,
              subTitle: disabilityPensionFormMessage.prerequisites.incomeText,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationWithholdingTaxApi,
              title: disabilityPensionFormMessage.prerequisites.incomeTitle,
              subTitle: disabilityPensionFormMessage.prerequisites.incomeText,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCategorizedIncomeTypesApi,
              title: disabilityPensionFormMessage.prerequisites.dataFetchTitle,
              subTitle:
                disabilityPensionFormMessage.prerequisites.dataFetchText,
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
        }),
      ],
    }),
  ],
})
