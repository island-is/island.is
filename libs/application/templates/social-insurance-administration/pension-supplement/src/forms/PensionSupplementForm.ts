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
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { pensionSupplementFormMessage } from '../lib/messages'
import {
  getApplicationReasonOptions,
  getApplicationAnswers,
} from '../lib/pensionSupplementUtils'
import { ApplicationReason, FILE_SIZE_LIMIT } from '../lib/constants'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'

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
            buildCustomField({
              id: 'paymentInfo',
              title: pensionSupplementFormMessage.payment.title,
              component: 'BankAccount',
            }),
          ],
        }),
        buildSubSection({
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
        buildSubSection({
          id: 'periodSection',
          title: pensionSupplementFormMessage.info.periodTitle,
          children: [
            buildMultiField({
              id: 'periodField',
              title: pensionSupplementFormMessage.info.periodTitle,
              description: pensionSupplementFormMessage.info.periodDescription,
              children: [
                buildCustomField({
                  id: 'period',
                  title: pensionSupplementFormMessage.info.periodTitle,
                  component: 'Period',
                }),
              ],
            }),
          ],
        }),
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
      title: pensionSupplementFormMessage.confirm.section,
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
        buildCustomField({
          id: 'thankYou',
          title: pensionSupplementFormMessage.conclusionScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
