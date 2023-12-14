import {
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  buildCustomField,
  buildRadioField,
  buildFileUploadField,
  buildAlertMessageField,
  buildSelectField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
  YES,
} from '@island.is/application/types'
import { householdSupplementFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'
import { HouseholdSupplementHousing } from '../lib/constants'
import {
  isExistsCohabitantOlderThan25,
  getApplicationAnswers,
  getApplicationExternalData,
  getAvailableYears,
  getAvailableMonths,
} from '../lib/householdSupplementUtils'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import {
  BankAccountType,
  FILE_SIZE_LIMIT,
} from '@island.is/application/templates/social-insurance-administration-core/constants'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import isEmpty from 'lodash/isEmpty'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  getBankIsk,
  typeOfBankInfo,
  getCurrencies,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const HouseholdSupplementForm: Form = buildForm({
  id: 'HouseholdSupplementDraft',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
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
      id: 'householdSupplementSection',
      title: householdSupplementFormMessage.shared.householdSupplement,
      children: [
        buildMultiField({
          id: 'householdSupplement',
          title: householdSupplementFormMessage.shared.householdSupplement,
          description:
            householdSupplementFormMessage.info.householdSupplementDescription,
          children: [
            buildAlertMessageField({
              id: 'householdSupplement.alert',
              title:
                householdSupplementFormMessage.info
                  .householdSupplementAlertTitle,
              message:
                householdSupplementFormMessage.info
                  .householdSupplementAlertDescription,
              doesNotRequireAnswer: true,
              alertType: 'warning',
              condition: (_, externalData) => {
                return isExistsCohabitantOlderThan25(externalData)
              },
            }),
            buildRadioField({
              id: 'householdSupplement.housing',
              title:
                householdSupplementFormMessage.info.householdSupplementHousing,
              options: [
                {
                  value: HouseholdSupplementHousing.HOUSEOWNER,
                  label:
                    householdSupplementFormMessage.info
                      .householdSupplementHousingOwner,
                },
                {
                  value: HouseholdSupplementHousing.RENTER,
                  label:
                    householdSupplementFormMessage.info
                      .householdSupplementHousingRenter,
                },
              ],
              width: 'half',
              required: true,
            }),
            buildRadioField({
              id: 'householdSupplement.children',
              title:
                householdSupplementFormMessage.info
                  .householdSupplementChildrenBetween18And25,
              options: getYesNoOptions(),
              width: 'half',
              required: true,
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
          description: householdSupplementFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: socialInsuranceAdministrationMessage.period.year,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.yearDefaultText,
              options: (application: Application) => {
                return getAvailableYears(application)
              },
            }),
            buildSelectField({
              id: 'period.month',
              title: socialInsuranceAdministrationMessage.period.month,
              width: 'half',
              placeholder:
                socialInsuranceAdministrationMessage.period.monthDefaultText,
              options: (application: Application) => {
                const { selectedYear: year } = getApplicationAnswers(
                  application.answers,
                )
                const rightYear = year ?? new Date().getFullYear().toString()
                return getAvailableMonths(application, rightYear)
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fileUpload',
      title: householdSupplementFormMessage.fileUpload.title,
      condition: (answers) => {
        const { householdSupplementHousing, householdSupplementChildren } =
          getApplicationAnswers(answers)
        return (
          householdSupplementHousing === HouseholdSupplementHousing.RENTER ||
          householdSupplementChildren === YES
        )
      },
      children: [
        buildSubSection({
          id: 'fileUploadLeaseAgreement',
          title: householdSupplementFormMessage.fileUpload.leaseAgreementTitle,
          condition: (answers) => {
            const { householdSupplementHousing } =
              getApplicationAnswers(answers)
            return (
              householdSupplementHousing === HouseholdSupplementHousing.RENTER
            )
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.leaseAgreement',
              title:
                householdSupplementFormMessage.fileUpload.leaseAgreementTitle,
              description:
                householdSupplementFormMessage.fileUpload.leaseAgreement,
              introduction:
                householdSupplementFormMessage.fileUpload.leaseAgreement,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                householdSupplementFormMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                householdSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                householdSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                householdSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadSchoolConfirmation',
          title:
            householdSupplementFormMessage.fileUpload.schoolConfirmationTitle,
          condition: (answers) => {
            const { householdSupplementChildren } =
              getApplicationAnswers(answers)
            return householdSupplementChildren === YES
          },
          children: [
            buildFileUploadField({
              id: 'fileUpload.schoolConfirmation',
              title:
                householdSupplementFormMessage.fileUpload
                  .schoolConfirmationTitle,
              description:
                householdSupplementFormMessage.fileUpload.schoolConfirmation,
              introduction:
                householdSupplementFormMessage.fileUpload.schoolConfirmation,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                householdSupplementFormMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                householdSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                householdSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                householdSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: householdSupplementFormMessage.additionalInfo.section,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: householdSupplementFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title:
                householdSupplementFormMessage.fileUpload.additionalFileTitle,
              description:
                householdSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                householdSupplementFormMessage.fileUpload
                  .additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                householdSupplementFormMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                householdSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                householdSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                householdSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: householdSupplementFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: householdSupplementFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description: householdSupplementFormMessage.comment.description,
              placeholder: householdSupplementFormMessage.comment.placeholder,
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
        socialInsuranceAdministrationMessage.conclusionScreen.receivedTitle,
      alertTitle:
        socialInsuranceAdministrationMessage.conclusionScreen.alertTitle,
      alertMessage:
        householdSupplementFormMessage.conclusionScreen.alertMessage,
      expandableDescription:
        householdSupplementFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        householdSupplementFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
