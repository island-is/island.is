import {
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubSection,
  buildTextField,
  buildCustomField,
  buildSubmitField,
  buildCheckboxField,
  buildFileUploadField,
  buildAlertMessageField,
  buildRadioField,
  buildSelectField,
} from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { pensionSupplementFormMessage } from '../lib/messages'
import {
  getApplicationReasonOptions,
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailableYears,
} from '../lib/pensionSupplementUtils'
import { ApplicationReason } from '../lib/constants'
import {
  MONTHS,
  fileUploadSharedProps,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import isEmpty from 'lodash/isEmpty'
import { BankAccountType } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  getCurrencies,
  typeOfBankInfo,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const PensionSupplementForm: Form = buildForm({
  id: 'PensionSupplementDraft',
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
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reason',
      title: pensionSupplementFormMessage.applicationReason.title,
      children: [
        buildCheckboxField({
          id: 'applicationReason',
          title: pensionSupplementFormMessage.applicationReason.title,
          description:
            pensionSupplementFormMessage.applicationReason.description,
          required: true,
          options: getApplicationReasonOptions(),
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
          description: pensionSupplementFormMessage.info.periodDescription,
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
      id: 'fileUpload',
      title: socialInsuranceAdministrationMessage.fileUpload.title,
      condition: (answers) => {
        const { applicationReason } = getApplicationAnswers(answers)

        const reasons = [
          ApplicationReason.ASSISTED_CARE_AT_HOME,
          ApplicationReason.HELPING_EQUIPMENT,
          ApplicationReason.ASSISTED_LIVING,
          ApplicationReason.HALFWAY_HOUSE,
          ApplicationReason.HOUSE_RENT,
        ]

        return (
          applicationReason &&
          reasons.some((r) => applicationReason.includes(r))
        )
      },
      children: [
        buildSubSection({
          id: 'fileUploadAssistedCareAtHome',
          title:
            pensionSupplementFormMessage.fileUpload.assistedCareAtHomeTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(
                ApplicationReason.ASSISTED_CARE_AT_HOME,
              )
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.assistedCareAtHome',
              title:
                pensionSupplementFormMessage.fileUpload.assistedCareAtHomeTitle,
              description:
                pensionSupplementFormMessage.fileUpload.assistedCareAtHome,
              introduction:
                pensionSupplementFormMessage.fileUpload.assistedCareAtHome,
              ...fileUploadSharedProps,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadPurchaseOfHearingAids',
          title:
            pensionSupplementFormMessage.fileUpload.purchaseOfHearingAidsTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(ApplicationReason.HELPING_EQUIPMENT)
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.purchaseOfHearingAids',
              title:
                pensionSupplementFormMessage.fileUpload
                  .purchaseOfHearingAidsTitle,
              description:
                pensionSupplementFormMessage.fileUpload.purchaseOfHearingAids,
              introduction:
                pensionSupplementFormMessage.fileUpload.purchaseOfHearingAids,
              ...fileUploadSharedProps,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadAssistedLiving',
          title: pensionSupplementFormMessage.fileUpload.assistedLivingTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(ApplicationReason.ASSISTED_LIVING)
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.assistedLiving',
              title:
                pensionSupplementFormMessage.fileUpload.assistedLivingTitle,
              description:
                pensionSupplementFormMessage.fileUpload.assistedLiving,
              introduction:
                pensionSupplementFormMessage.fileUpload.assistedLiving,
              ...fileUploadSharedProps,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadHalfwayHouse',
          title: pensionSupplementFormMessage.fileUpload.halfwayHouseTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(ApplicationReason.HALFWAY_HOUSE)
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.halfwayHouse',
              title: pensionSupplementFormMessage.fileUpload.halfwayHouseTitle,
              description: pensionSupplementFormMessage.fileUpload.halfwayHouse,
              introduction:
                pensionSupplementFormMessage.fileUpload.halfwayHouse,
              ...fileUploadSharedProps,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadHouseRentAgreement',
          title: pensionSupplementFormMessage.fileUpload.houseRentSectionTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(ApplicationReason.HOUSE_RENT)
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.houseRentAgreement',
              title: pensionSupplementFormMessage.fileUpload.houseRentTitle,
              description:
                pensionSupplementFormMessage.fileUpload.houseRentAgreement,
              introduction:
                pensionSupplementFormMessage.fileUpload.houseRentAgreement,
              ...fileUploadSharedProps,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadHouseRentAllowance',
          title: pensionSupplementFormMessage.fileUpload.houseRentSectionTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return (
              applicationReason &&
              applicationReason.includes(ApplicationReason.HOUSE_RENT)
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.houseRentAllowance',
              title: pensionSupplementFormMessage.fileUpload.houseRentTitle,
              description:
                pensionSupplementFormMessage.fileUpload.houseRentAllowance,
              introduction:
                pensionSupplementFormMessage.fileUpload.houseRentAllowance,
              ...fileUploadSharedProps,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
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
                pensionSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                pensionSupplementFormMessage.fileUpload
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
        socialInsuranceAdministrationMessage.conclusionScreen.receivedTitle,
      alertTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.alertTitle,
      alertMessage: pensionSupplementFormMessage.conclusionScreen.alertTitle,
      expandableDescription:
        pensionSupplementFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        pensionSupplementFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
