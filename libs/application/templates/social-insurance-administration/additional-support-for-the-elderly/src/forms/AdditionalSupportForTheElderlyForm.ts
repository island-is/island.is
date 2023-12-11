import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildPhoneField,
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
} from '@island.is/application/types'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import { FILE_SIZE_LIMIT } from '@island.is/application/templates/social-insurance-administration-core/constants'
import { getAvailableYears } from '../lib/additionalSupportForTheElderlyUtils'
import { MONTHS } from '../lib/constants'
import { ApplicantInfo } from '@island.is/application/templates/social-insurance-administration-core/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { getApplicationAnswers } from '../lib/additionalSupportForTheElderlyUtils'

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
