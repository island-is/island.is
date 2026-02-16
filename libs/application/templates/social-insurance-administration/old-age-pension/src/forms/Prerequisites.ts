import {
  buildAlertMessageField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryV3SpouseApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { ApplicationType } from '../lib/constants'
import { oldAgePensionFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getEligibleDesc,
  getEligibleLabel,
} from '../lib/oldAgePensionUtils'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  NationalRegistryResidenceHistoryApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationIncomePlanConditionsApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'applicationType',
          title: oldAgePensionFormMessage.pre.applicationTypeTitle,
          children: [
            buildRadioField({
              id: 'applicationType.option',
              title: oldAgePensionFormMessage.pre.applicationTypeTitle,
              description:
                oldAgePensionFormMessage.pre.applicationTypeDescription,
              options: [
                {
                  value: ApplicationType.OLD_AGE_PENSION,
                  dataTestId: 'old-age-pension',
                  label: oldAgePensionFormMessage.shared.applicationTitle,
                  subLabel:
                    oldAgePensionFormMessage.pre
                      .retirementPensionApplicationDescription,
                },
                {
                  value: ApplicationType.HALF_OLD_AGE_PENSION,
                  dataTestId: 'half-old-age-pension',
                  label:
                    oldAgePensionFormMessage.pre
                      .halfRetirementPensionApplicationTitle,
                  subLabel:
                    oldAgePensionFormMessage.pre
                      .halfRetirementPensionApplicationDescription,
                },
                {
                  value: ApplicationType.SAILOR_PENSION,
                  dataTestId: 'sailor-pension',
                  label: oldAgePensionFormMessage.pre.fishermenApplicationTitle,
                  subLabel:
                    oldAgePensionFormMessage.pre
                      .fishermenApplicationDescription,
                },
              ],
              required: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: socialInsuranceAdministrationMessage.pre.externalDataSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title:
                socialInsuranceAdministrationMessage.pre.externalDataSection,
              subTitle: oldAgePensionFormMessage.pre.externalDataDescription,
              checkboxLabel:
                socialInsuranceAdministrationMessage.pre.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  provider: NationalRegistryV3UserApi,
                  title:
                    socialInsuranceAdministrationMessage.pre
                      .skraInformationTitle,
                  subTitle:
                    oldAgePensionFormMessage.pre.skraInformationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryResidenceHistoryApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: NationalRegistryV3SpouseApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: UserProfileApi,
                  title:
                    socialInsuranceAdministrationMessage.pre.contactInfoTitle,
                  subTitle:
                    socialInsuranceAdministrationMessage.pre
                      .contactInfoDescription,
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
                  title: '',
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationCurrenciesApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationLatestIncomePlan,
                  title: '',
                }),
                buildDataProviderItem({
                  provider:
                    SocialInsuranceAdministrationCategorizedIncomeTypesApi,
                }),
                buildDataProviderItem({
                  provider:
                    SocialInsuranceAdministrationIncomePlanConditionsApi,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'questions',
          title: oldAgePensionFormMessage.pre.questionTitle,
          condition: (_, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is eligible
            return isEligible
          },
          children: [
            buildMultiField({
              id: 'questions',
              title: oldAgePensionFormMessage.pre.questionTitle,
              description:
                oldAgePensionFormMessage.pre.pensionFundQuestionDescription,
              children: [
                buildRadioField({
                  id: 'questions.pensionFund',
                  options: getYesNoOptions(),
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'question.pensionFundAlert',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message:
                    oldAgePensionFormMessage.pre.pensionFundAlertDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'error',
                  condition: (answers) => {
                    const { pensionFundQuestion } =
                      getApplicationAnswers(answers)

                    return pensionFundQuestion === NO
                  },
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: oldAgePensionFormMessage.pre.confirmationTitle,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: socialInsuranceAdministrationMessage.pre
                        .startApplication,
                      type: 'primary',
                      condition: (answers) => {
                        const { pensionFundQuestion } =
                          getApplicationAnswers(answers)

                        return pensionFundQuestion !== NO
                      },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'isNotEligible',
          title: getEligibleLabel,
          condition: (_, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is not eligible
            return !isEligible
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              description: getEligibleDesc,
            }),
            // Empty submit field to hide all buttons in the footer
            buildSubmitField({
              id: '',
              actions: [],
            }),
          ],
        }),
      ],
    }),
  ],
})
