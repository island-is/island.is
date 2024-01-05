import {
  buildAlertMessageField,
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
  YES,
} from '@island.is/application/types'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  typeOfBankInfo,
  getCurrencies,
  getYesNoOptions,
  getTaxOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  BankAccountType,
  fileUploadSharedProps,
  MONTHS,
  TaxLevelOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  getApplicationExternalData,
  getAvailableYears,
} from '../lib/additionalSupportForTheElderlyUtils'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { getApplicationAnswers } from '../lib/additionalSupportForTheElderlyUtils'
import isEmpty from 'lodash/isEmpty'

export const AdditionalSupportForTheElderlyForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: socialInsuranceAdministrationMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: socialInsuranceAdministrationMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: socialInsuranceAdministrationMessage.info.subSectionTitle,
              description:
                socialInsuranceAdministrationMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title:
                    socialInsuranceAdministrationMessage.info.applicantEmail,
                  width: 'half',
                  variant: 'email',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData
                      .socialInsuranceAdministrationApplicant
                      .data as ApplicantInfo
                    return data.emailAddress
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title:
                    socialInsuranceAdministrationMessage.info
                      .applicantPhonenumber,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const data = application.externalData
                      .socialInsuranceAdministrationApplicant
                      .data as ApplicantInfo
                    return data.phoneNumber
                  },
                }),
              ],
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
                  message: (application: Application) => {
                    const { bankAccountType } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    const type =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)

                    return type === BankAccountType.ICELANDIC
                      ? socialInsuranceAdministrationMessage.payment
                          .alertMessage
                      : socialInsuranceAdministrationMessage.payment
                          .alertMessageForeign
                  },
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildRadioField({
                  id: 'paymentInfo.bankAccountType',
                  title: '',
                  defaultValue: (application: Application) => {
                    const { bankAccountType } = getApplicationAnswers(
                      application.answers,
                    )
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )

                    return typeOfBankInfo(bankInfo, bankAccountType)
                  },
                  options: [
                    {
                      label:
                        socialInsuranceAdministrationMessage.payment
                          .icelandicBankAccount,
                      value: BankAccountType.ICELANDIC,
                    },
                    {
                      label:
                        socialInsuranceAdministrationMessage.payment
                          .foreignBankAccount,
                      value: BankAccountType.FOREIGN,
                    },
                  ],
                  largeButtons: false,
                  required: true,
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
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.ICELANDIC
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.iban',
                  title: socialInsuranceAdministrationMessage.payment.iban,
                  placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatIBAN(bankInfo.iban)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.swift',
                  title: socialInsuranceAdministrationMessage.payment.swift,
                  placeholder: 'AAAA BB CC XXX',
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatSWIFT(bankInfo.swift)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildSelectField({
                  id: 'paymentInfo.currency',
                  title: socialInsuranceAdministrationMessage.payment.currency,
                  width: 'half',
                  placeholder:
                    socialInsuranceAdministrationMessage.payment.selectCurrency,
                  options: ({ externalData }: Application) => {
                    const { currencies } =
                      getApplicationExternalData(externalData)
                    return getCurrencies(currencies)
                  },
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.currency : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankName',
                  title: socialInsuranceAdministrationMessage.payment.bankName,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankName : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankAddress',
                  title:
                    socialInsuranceAdministrationMessage.payment.bankAddress,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankAddress : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const { bankAccountType } = getApplicationAnswers(formValue)
                    const { bankInfo } =
                      getApplicationExternalData(externalData)

                    const radio =
                      bankAccountType ??
                      typeOfBankInfo(bankInfo, bankAccountType)
                    return radio === BankAccountType.FOREIGN
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
      title: socialInsuranceAdministrationMessage.period.title,
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
              options: MONTHS,
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
          id: 'fileUploadAdditionalFiles',
          title:
            socialInsuranceAdministrationMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title:
                socialInsuranceAdministrationMessage.fileUpload
                  .additionalFileTitle,
              description:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .additionalFileDescription,
              ...fileUploadSharedProps,
            }),
          ],
        }),
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
      ],
    }),
    buildSection({
      id: 'confirm',
      title: socialInsuranceAdministrationMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'confirm',
          title: '',
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
      bottomButtonLink: 'https://minarsidur.tr.is/forsendur/tekjuaetlun',
      bottomButtonLabel:
        socialInsuranceAdministrationMessage.conclusionScreen
          .incomePlanCardLabel,
      bottomButtonMessage:
        socialInsuranceAdministrationMessage.conclusionScreen
          .incomePlanCardText,
    }),
  ],
})
