import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getBankIsk,
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailableMonths,
  getAvailableYears,
  hasNoCohabitants,
} from '../lib/additionalSupportForTheElderlyUtils'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'

export const AdditionalSupportForTheElderlyForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'infoSection',
      title: socialInsuranceAdministrationMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: socialInsuranceAdministrationMessage.info.infoSubSectionTitle,
          children: [
            applicantInformationMultiField({
              emailRequired: false,
              emailDisabled: true,
              applicantInformationDescription:
                socialInsuranceAdministrationMessage.info
                  .infoSubSectionDescription,
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: socialInsuranceAdministrationMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: socialInsuranceAdministrationMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message:
                    socialInsuranceAdministrationMessage.payment.alertMessage,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: socialInsuranceAdministrationMessage.payment.bank,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return getBankIsk(bankInfo)
                  },
                }),
                buildRadioField({
                  id: 'paymentInfo.personalAllowance',
                  title:
                    socialInsuranceAdministrationMessage.payment
                      .personalAllowance,
                  options: getYesNoOptions(),
                  width: 'half',
                  largeButtons: true,
                  required: true,
                  space: 'containerGutter',
                }),
                buildTextField({
                  id: 'paymentInfo.personalAllowanceUsage',
                  title:
                    socialInsuranceAdministrationMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
                  dataTestId: 'personal-allowance-usage',
                  condition: (answers) => {
                    const { personalAllowance } = getApplicationAnswers(answers)
                    return personalAllowance === YES
                  },
                  placeholder: '1%',
                  defaultValue: '100',
                  variant: 'number',
                  width: 'half',
                  maxLength: 4,
                }),
                buildAlertMessageField({
                  id: 'payment.spouseAllowance.alert',
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  message:
                    socialInsuranceAdministrationMessage.payment
                      .alertSpouseAllowance,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (_, externalData) => {
                    const { hasSpouse } =
                      getApplicationExternalData(externalData)
                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildRadioField({
                  id: 'paymentInfo.taxLevel',
                  title: socialInsuranceAdministrationMessage.payment.taxLevel,
                  options: getTaxOptions(),
                  width: 'full',
                  largeButtons: true,
                  space: 'containerGutter',
                  defaultValue: TaxLevelOptions.INCOME,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'periodSection',
      title: socialInsuranceAdministrationMessage.period.overviewTitle,
      children: [
        buildMultiField({
          id: 'periodField',
          title: socialInsuranceAdministrationMessage.period.title,
          description:
            additionalSupportForTheElderyFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: socialInsuranceAdministrationMessage.period.year,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.yearDefaultText,
              options: getAvailableYears(),
            }),
            buildSelectField({
              id: 'period.month',
              title: socialInsuranceAdministrationMessage.period.month,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.monthDefaultText,
              options: (application: Application) => {
                const { selectedYear } = getApplicationAnswers(
                  application.answers,
                )

                return getAvailableMonths(selectedYear)
              },
              condition: (answers) => {
                const { selectedYear, selectedYearHiddenInput } =
                  getApplicationAnswers(answers)

                return selectedYear === selectedYearHiddenInput
              },
            }),
            buildHiddenInputWithWatchedValue({
              // Needed to trigger an update on options in the select above
              id: 'period.hiddenInput',
              watchValue: 'period.year',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'higherPayments',
      title:
        additionalSupportForTheElderyFormMessage.info.higherPaymentsCohabTitle,
      children: [
        buildMultiField({
          id: 'higherPayments',
          title: (application: Application) => {
            return hasNoCohabitants(application)
              ? additionalSupportForTheElderyFormMessage.info
                  .higherPaymentsTitle
              : additionalSupportForTheElderyFormMessage.info
                  .higherPaymentsCohabTitle
          },
          description: (application: Application) => {
            return hasNoCohabitants(application)
              ? additionalSupportForTheElderyFormMessage.info
                  .higherPaymentsDescription
              : additionalSupportForTheElderyFormMessage.info
                  .higherPaymentsCohabDescription
          },
          children: [
            buildRadioField({
              id: 'higherPayments.question',
              options: getYesNoOptions(),
              width: 'half',
              condition: (_, externalData) => {
                return hasNoCohabitants({ externalData } as Application)
              },
            }),
            buildDescriptionField({
              id: 'higherPayments.text',
              condition: (_, externalData) => {
                return !hasNoCohabitants({ externalData } as Application)
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: socialInsuranceAdministrationMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'commentSection',
          title:
            socialInsuranceAdministrationMessage.additionalInfo.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentSection,
              variant: 'textarea',
              rows: 10,
              description:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentDescription,
              placeholder:
                socialInsuranceAdministrationMessage.additionalInfo
                  .commentPlaceholder,
            }),
          ],
        }),
        buildSubSection({
          id: 'asfteInstructions',
          title:
            additionalSupportForTheElderyFormMessage.info
              .instructionsShortTitle,
          children: [
            buildCheckboxField({
              id: 'infoCheckbox',
              title:
                additionalSupportForTheElderyFormMessage.info.instructionsTitle,
              description:
                additionalSupportForTheElderyFormMessage.info
                  .instructionsDescription,
              required: true,
              options: [
                {
                  label:
                    additionalSupportForTheElderyFormMessage.info
                      .instructionsCheckbox,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'confirm',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'confirmScreen',
                title: '',
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: socialInsuranceAdministrationMessage.confirm.submitButton,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: socialInsuranceAdministrationMessage.confirm
                    .submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      multiFieldTitle:
        socialInsuranceAdministrationMessage.conclusionScreen
          .receivedAwaitingIncomePlanTitle,
      alertTitle:
        socialInsuranceAdministrationMessage.conclusionScreen
          .receivedAwaitingIncomePlanTitle,
      alertMessage:
        socialInsuranceAdministrationMessage.conclusionScreen
          .incomePlanAlertMessage,
      alertType: 'warning',
      expandableDescription:
        additionalSupportForTheElderyFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        additionalSupportForTheElderyFormMessage.conclusionScreen.nextStepsText,
      bottomButtonLink: 'https://island.is/umsoknir/tekjuaaetlun',
      bottomButtonLabel:
        socialInsuranceAdministrationMessage.conclusionScreen
          .incomePlanCardLabel,
      bottomButtonMessage:
        socialInsuranceAdministrationMessage.conclusionScreen
          .incomePlanCardText,
    }),
  ],
})
