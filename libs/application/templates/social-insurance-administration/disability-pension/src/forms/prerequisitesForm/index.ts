import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
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
} from '../../dataProviders'
import { disabilityPensionFormMessage } from '../../lib/messages'

//TODO: Fix and correct providers per item <---------- !!!!!!!!
export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  title: disabilityPensionFormMessage.shared.title,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'conditions',
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
    }),
    buildSection({
      id: 'PrerequisitesDraftExternalDataSection',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [],
    }),
  ],
})
