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
} from '@island.is/application/templates/social-insurance-administration-core/socialInsuranceAdministrationUtils'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import {
  BankAccountType,
  FILE_SIZE_LIMIT,
} from '@island.is/application/templates/social-insurance-administration-core/constants'
import {
  getApplicationExternalData,
  getAvailableYears,
  getTaxOptions,
  getYesNOOptions,
} from '../lib/additionalSupportForTheElderlyUtils'
import { MONTHS, TaxLevelOptions } from '../lib/constants'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { getApplicationAnswers } from '../lib/additionalSupportForTheElderlyUtils'
import isEmpty from 'lodash/isEmpty'

export const AdditionalSupportForTheElderlyForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyDraft',
  title: additionalSupportForTheElderyFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: additionalSupportForTheElderyFormMessage.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: additionalSupportForTheElderyFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'info',
          title: additionalSupportForTheElderyFormMessage.info.subSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title:
                additionalSupportForTheElderyFormMessage.info.subSectionTitle,
              description:
                additionalSupportForTheElderyFormMessage.info
                  .subSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.email',
                  title:
                    additionalSupportForTheElderyFormMessage.info
                      .applicantEmail,
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
                    additionalSupportForTheElderyFormMessage.info
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
          title: additionalSupportForTheElderyFormMessage.payment.title,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: additionalSupportForTheElderyFormMessage.payment.title,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alertMessage',
                  title:
                    additionalSupportForTheElderyFormMessage.shared.alertTitle,
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
                      ? additionalSupportForTheElderyFormMessage.payment
                          .alertMessage
                      : additionalSupportForTheElderyFormMessage.payment
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
                        additionalSupportForTheElderyFormMessage.payment
                          .icelandicBankAccount,
                      value: BankAccountType.ICELANDIC,
                    },
                    {
                      label:
                        additionalSupportForTheElderyFormMessage.payment
                          .foreignBankAccount,
                      value: BankAccountType.FOREIGN,
                    },
                  ],
                  largeButtons: false,
                  required: true,
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: additionalSupportForTheElderyFormMessage.payment.bank,
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
                  title: additionalSupportForTheElderyFormMessage.payment.iban,
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
                  title: additionalSupportForTheElderyFormMessage.payment.swift,
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
                  title:
                    additionalSupportForTheElderyFormMessage.payment.currency,
                  width: 'half',
                  placeholder:
                    additionalSupportForTheElderyFormMessage.payment
                      .selectCurrency,
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
                  title:
                    additionalSupportForTheElderyFormMessage.payment.bankName,
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
                    additionalSupportForTheElderyFormMessage.payment
                      .bankAddress,
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
                    additionalSupportForTheElderyFormMessage.payment
                      .personalAllowance,
                  options: getYesNOOptions(),
                  width: 'half',
                  largeButtons: true,
                  required: true,
                  space: 'containerGutter',
                }),
                buildTextField({
                  id: 'paymentInfo.personalAllowanceUsage',
                  title:
                    additionalSupportForTheElderyFormMessage.payment
                      .personalAllowancePercentage,
                  suffix: '%',
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
                  title:
                    additionalSupportForTheElderyFormMessage.shared.alertTitle,
                  message:
                    additionalSupportForTheElderyFormMessage.payment
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
                  title:
                    additionalSupportForTheElderyFormMessage.payment.taxLevel,
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
      title: additionalSupportForTheElderyFormMessage.info.periodTitle,
      children: [
        buildMultiField({
          id: 'periodField',
          title: additionalSupportForTheElderyFormMessage.info.periodTitle,
          description:
            additionalSupportForTheElderyFormMessage.info.periodDescription,
          children: [
            buildSelectField({
              id: 'period.year',
              title: additionalSupportForTheElderyFormMessage.info.periodYear,
              width: 'half',
              placeholder:
                additionalSupportForTheElderyFormMessage.info
                  .periodYearDefaultText,
              options: (application: Application) => {
                return getAvailableYears(application)
              },
            }),
            buildSelectField({
              id: 'period.month',
              title: additionalSupportForTheElderyFormMessage.info.periodMonth,
              width: 'half',
              placeholder:
                additionalSupportForTheElderyFormMessage.info
                  .periodMonthDefaultText,
              options: MONTHS,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title:
        additionalSupportForTheElderyFormMessage.comment.additionalInfoTitle,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title:
            additionalSupportForTheElderyFormMessage.fileUpload
              .additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .additionalFileTitle,
              description:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .additionalFileDescription,
              introduction:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .attachmentHeader,
              uploadDescription:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .attachmentDescription,
              uploadButtonLabel:
                additionalSupportForTheElderyFormMessage.fileUpload
                  .attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title:
            additionalSupportForTheElderyFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title:
                additionalSupportForTheElderyFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description:
                additionalSupportForTheElderyFormMessage.comment.description,
              placeholder:
                additionalSupportForTheElderyFormMessage.comment.placeholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: additionalSupportForTheElderyFormMessage.confirm.overviewTitle,
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
              title: additionalSupportForTheElderyFormMessage.confirm.title,
              actions: [
                {
                  event: DefaultEvents.ABORT,
                  name: additionalSupportForTheElderyFormMessage.confirm
                    .cancelButton,
                  type: 'reject',
                  condition: (answers) => {
                    const { tempAnswers } = getApplicationAnswers(answers)
                    return !!tempAnswers
                  },
                },
                {
                  event: DefaultEvents.SUBMIT,
                  name: additionalSupportForTheElderyFormMessage.confirm.title,
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
        additionalSupportForTheElderyFormMessage.conclusionScreen.title,
      alertTitle:
        additionalSupportForTheElderyFormMessage.conclusionScreen.title,
      alertMessage:
        additionalSupportForTheElderyFormMessage.conclusionScreen.alertTitle,
      alertType: 'warning',
      expandableDescription:
        additionalSupportForTheElderyFormMessage.conclusionScreen.bulletList,
      expandableIntro:
        additionalSupportForTheElderyFormMessage.conclusionScreen.nextStepsText,
      bottomButtonLink: 'https://minarsidur.tr.is/forsendur/tekjuaetlun',
      bottomButtonLabel:
        additionalSupportForTheElderyFormMessage.conclusionScreen
          .incomePlanCardLabel,
      bottomButtonMessage:
        additionalSupportForTheElderyFormMessage.conclusionScreen
          .incomePlanCardText,
    }),
  ],
})
