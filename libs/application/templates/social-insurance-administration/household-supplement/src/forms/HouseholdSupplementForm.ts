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
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { householdSupplementFormMessage } from '../lib/messages'
import {
  HouseholdSupplementHousing,
  FILE_SIZE_LIMIT,
  YES,
} from '../lib/constants'
import {
  getYesNOOptions,
  isExistsCohabitantOlderThan25,
  getApplicationAnswers,
} from '../lib/householdSupplementUtils'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'

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
          title: householdSupplementFormMessage.info.paymentTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: householdSupplementFormMessage.info.paymentTitle,
              description: '',
              children: [
                buildAlertMessageField({
                  id: 'paymentInfo.alert',
                  title: householdSupplementFormMessage.info.paymentAlertTitle,
                  message:
                    householdSupplementFormMessage.info.paymentAlertMessage,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: householdSupplementFormMessage.info.paymentBank,
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const data = application.externalData
                      .socialInsuranceAdministrationApplicant
                      .data as ApplicantInfo

                    // TODO: Tímabundið (Þangað til nýja BankAccount component er búið til)
                    return data.bankAccount &&
                      data.bankAccount.bank &&
                      data.bankAccount.ledger &&
                      data.bankAccount.accountNumber
                      ? data.bankAccount.bank +
                          data.bankAccount.ledger +
                          data.bankAccount.accountNumber
                      : ''
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'householdSupplementSection',
          title: householdSupplementFormMessage.shared.householdSupplement,
          children: [
            buildMultiField({
              id: 'householdSupplement',
              title: householdSupplementFormMessage.shared.householdSupplement,
              description:
                householdSupplementFormMessage.info
                  .householdSupplementDescription,
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
                    householdSupplementFormMessage.info
                      .householdSupplementHousing,
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
        buildSubSection({
          id: 'periodSection',
          title: householdSupplementFormMessage.info.periodTitle,
          children: [
            buildMultiField({
              id: 'periodField',
              title: householdSupplementFormMessage.info.periodTitle,
              description:
                householdSupplementFormMessage.info.periodDescription,
              children: [
                buildCustomField({
                  id: 'period',
                  title: householdSupplementFormMessage.info.periodTitle,
                  component: 'Period',
                }),
              ],
            }),
          ],
        }),
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
      title: householdSupplementFormMessage.confirm.section,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: householdSupplementFormMessage.confirm.title,
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
        buildCustomField({
          id: 'thankYou',
          title: householdSupplementFormMessage.conclusionScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
