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
import { ApplicationReason, MONTHS } from '../lib/constants'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import isEmpty from 'lodash/isEmpty'
import {
  BankAccountType,
  FILE_SIZE_LIMIT,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  getCurrencies,
  typeOfBankInfo,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const PensionSupplementForm: Form = buildForm({
  id: 'PensionSupplementDraft',
  title: pensionSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: pensionSupplementFormMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: pensionSupplementFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: pensionSupplementFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: pensionSupplementFormMessage.info.subSectionTitle,
              description:
                pensionSupplementFormMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title: pensionSupplementFormMessage.info.applicantEmail,
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
                  title: pensionSupplementFormMessage.info.applicantPhonenumber,
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
          title: pensionSupplementFormMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: pensionSupplementFormMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title: pensionSupplementFormMessage.shared.alertTitle,
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
                      ? pensionSupplementFormMessage.payment.alertMessage
                      : pensionSupplementFormMessage.payment.alertMessageForeign
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
                        pensionSupplementFormMessage.payment
                          .icelandicBankAccount,
                      value: BankAccountType.ICELANDIC,
                    },
                    {
                      label:
                        pensionSupplementFormMessage.payment.foreignBankAccount,
                      value: BankAccountType.FOREIGN,
                    },
                  ],
                  largeButtons: false,
                  required: true,
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: pensionSupplementFormMessage.payment.bank,
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
                  title: pensionSupplementFormMessage.payment.iban,
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
                  title: pensionSupplementFormMessage.payment.swift,
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
                  title: pensionSupplementFormMessage.payment.currency,
                  width: 'half',
                  placeholder:
                    pensionSupplementFormMessage.payment.selectCurrency,
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
                  title: pensionSupplementFormMessage.payment.bankName,
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
                  title: pensionSupplementFormMessage.payment.bankAddress,
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
      title: pensionSupplementFormMessage.info.periodTitle,
      children: [
        buildMultiField({
          id: 'periodField',
          title: pensionSupplementFormMessage.info.periodTitle,
          description: pensionSupplementFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: pensionSupplementFormMessage.info.periodYear,
              width: 'half',
              placeholder:
                pensionSupplementFormMessage.info.periodYearDefaultText,
              options: getAvailableYears(),
            }),
            buildSelectField({
              id: 'period.month',
              title: pensionSupplementFormMessage.info.periodMonth,
              width: 'half',
              placeholder:
                pensionSupplementFormMessage.info.periodMonthDefaultText,
              options: MONTHS,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fileUpload',
      title: pensionSupplementFormMessage.fileUpload.title,
      condition: (answers) => {
        const { applicationReason } = getApplicationAnswers(answers)

        const reasons = [
          ApplicationReason.ASSISTED_CARE_AT_HOME,
          ApplicationReason.PURCHASE_OF_HEARING_AIDS,
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
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
              applicationReason.includes(
                ApplicationReason.PURCHASE_OF_HEARING_AIDS,
              )
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
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
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: pensionSupplementFormMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: pensionSupplementFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title:
                pensionSupplementFormMessage.fileUpload.additionalFileTitle,
              description:
                pensionSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                pensionSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                pensionSupplementFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                pensionSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                pensionSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                pensionSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: pensionSupplementFormMessage.additionalInfo.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: pensionSupplementFormMessage.additionalInfo.commentSection,
              variant: 'textarea',
              rows: 10,
              description:
                pensionSupplementFormMessage.additionalInfo.commentDescription,
              placeholder:
                pensionSupplementFormMessage.additionalInfo.commentPlaceholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: pensionSupplementFormMessage.confirm.overviewTitle,
      children: [
        buildMultiField({
          id: 'confirm',
          title: '',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'confirmScreen',
                title: pensionSupplementFormMessage.confirm.title,
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: pensionSupplementFormMessage.confirm.title,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: pensionSupplementFormMessage.confirm.cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: pensionSupplementFormMessage.confirm.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: pensionSupplementFormMessage.conclusionScreen.title,
      alertMessage: pensionSupplementFormMessage.conclusionScreen.alertTitle,
      expandableDescription:
        pensionSupplementFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        pensionSupplementFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
