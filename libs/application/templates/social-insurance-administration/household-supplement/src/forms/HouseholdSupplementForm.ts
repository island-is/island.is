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
import { HouseholdSupplementHousing } from '../lib/constants'
import {
  getYesNOOptions,
  isExistsCohabitantOlderThan25,
  getApplicationAnswers,
  getApplicationExternalData,
  typeOfBankInfo,
  getCurrencies,
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
} from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const HouseholdSupplementForm: Form = buildForm({
  id: 'HouseholdSupplementDraft',
  title: householdSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: householdSupplementFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: householdSupplementFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: householdSupplementFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title: householdSupplementFormMessage.info.subSectionTitle,
              description:
                householdSupplementFormMessage.info.subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title: householdSupplementFormMessage.info.applicantEmail,
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
                    householdSupplementFormMessage.info.applicantPhonenumber,
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
          title: householdSupplementFormMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: householdSupplementFormMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title: householdSupplementFormMessage.shared.alertTitle,
                  message: (application: Application) => {
                    const { bankAccountType } = getApplicationAnswers(
                      application.answers,
                    )
                    const type =
                      bankAccountType ??
                      typeOfBankInfo(
                        application.answers,
                        application.externalData,
                      )

                    return type === BankAccountType.ICELANDIC
                      ? householdSupplementFormMessage.payment.alertMessage
                      : householdSupplementFormMessage.payment
                          .alertMessageForeign
                  },
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildRadioField({
                  id: 'paymentInfo.bankAccountType',
                  title: '',
                  defaultValue: (application: Application) =>
                    typeOfBankInfo(
                      application.answers,
                      application.externalData,
                    ),
                  options: [
                    {
                      label:
                        householdSupplementFormMessage.payment
                          .icelandicBankAccount,
                      value: BankAccountType.ICELANDIC,
                    },
                    {
                      label:
                        householdSupplementFormMessage.payment
                          .foreignBankAccount,
                      value: BankAccountType.FOREIGN,
                    },
                  ],
                  largeButtons: false,
                  required: true,
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: householdSupplementFormMessage.payment.bank,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return getBankIsk(bankInfo)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
                    return radio === BankAccountType.ICELANDIC
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.iban',
                  title: householdSupplementFormMessage.payment.iban,
                  placeholder: 'AB00 XXXX XXXX XXXX XXXX XX',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatIBAN(bankInfo.iban)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.swift',
                  title: householdSupplementFormMessage.payment.swift,
                  placeholder: 'AAAA BB CC XXX',
                  width: 'half',
                  onChange: (e) => {
                    console.log('e ', e)
                    const formattedSWIFT = friendlyFormatSWIFT(e.target.value)
                    console.log('formatted ', formattedSWIFT)
                  },
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return friendlyFormatSWIFT(bankInfo.swift)
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildSelectField({
                  id: 'paymentInfo.currency',
                  title: householdSupplementFormMessage.payment.currency,
                  width: 'half',
                  placeholder:
                    householdSupplementFormMessage.payment.selectCurrency,
                  options: ({ externalData }: Application) =>
                    getCurrencies(externalData),
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.currency : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankName',
                  title: householdSupplementFormMessage.payment.bankName,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankName : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
                    return radio === BankAccountType.FOREIGN
                  },
                }),
                buildTextField({
                  id: 'paymentInfo.bankAddress',
                  title: householdSupplementFormMessage.payment.bankAddress,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const { bankInfo } = getApplicationExternalData(
                      application.externalData,
                    )
                    return !isEmpty(bankInfo) ? bankInfo.foreignBankAddress : ''
                  },
                  condition: (formValue: FormValue, externalData) => {
                    const radio =
                      (formValue.paymentInfo as FormValue)?.bankAccountType ??
                      typeOfBankInfo(formValue, externalData)
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
              options: getYesNOOptions(),
              width: 'half',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'periodSection',
      title: householdSupplementFormMessage.info.periodTitle,
      children: [
        buildMultiField({
          id: 'period',
          title: householdSupplementFormMessage.info.periodTitle,
          description: householdSupplementFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: householdSupplementFormMessage.info.periodYear,
              width: 'half',
              placeholder: householdSupplementFormMessage.info.periodYearDefaultText,
              options: (application: Application) => {
                return getAvailableYears(application)
              },
            }),  
            buildSelectField({
              id: 'period.month',
              title: householdSupplementFormMessage.info.periodMonth,
              width: 'half',
              placeholder: householdSupplementFormMessage.info.periodMonthDefaultText,
              options: (application: Application) => {
                const { selectedYear: year} = getApplicationAnswers(
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
      title: householdSupplementFormMessage.confirm.overviewTitle,
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
              title: householdSupplementFormMessage.confirm.title,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: householdSupplementFormMessage.confirm.cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: householdSupplementFormMessage.confirm.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      multiFieldTitle: householdSupplementFormMessage.conclusionScreen.title,
      alertTitle: householdSupplementFormMessage.conclusionScreen.alertTitle,
      alertMessage:
        householdSupplementFormMessage.conclusionScreen.alertMessage,
      expandableDescription:
        householdSupplementFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        householdSupplementFormMessage.conclusionScreen.nextStepsText,
    }),
  ],
})
