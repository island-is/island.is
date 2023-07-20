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
import { UserProfile } from '@island.is/api/schema'
import {
  getApplicationReasonOptions,
  getApplicationAnswers,
} from '../lib/pensionSupplementUtils'
import { ApplicationReason, FILE_SIZE_LIMIT } from '../lib/constants'

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
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.email
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title: pensionSupplementFormMessage.info.applicantPhonenumber,
                  width: 'half',
                  placeholder: '000-0000',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.mobilePhoneNumber
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: pensionSupplementFormMessage.info.paymentTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: pensionSupplementFormMessage.info.paymentTitle,
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'paymentInfo.alert',
                    title: pensionSupplementFormMessage.info.paymentAlertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      pensionSupplementFormMessage.info.paymentAlertMessage,
                  },
                  { type: 'info' },
                ),
                buildTextField({
                  id: 'paymentInfo.bank',
                  title: pensionSupplementFormMessage.info.paymentBank,
                  backgroundColor: 'white',
                  format: '####-##-######',
                  placeholder: '0000-00-000000',
                  defaultValue: (application: Application) => {
                    const userProfile = application.externalData.userProfile
                      .data as UserProfile
                    return userProfile.bankInfo
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'reason',
          title: pensionSupplementFormMessage.info.applicationReasonTitle,
          children: [
            buildCheckboxField({
              id: 'applicationReason',
              title: pensionSupplementFormMessage.info.applicationReasonTitle,
              description:
                pensionSupplementFormMessage.info.applicationReasonDescription,
              required: true,
              options: getApplicationReasonOptions(),
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadAssistedCareAtHome',
          title:
            pensionSupplementFormMessage.fileUpload.assistedCareAtHomeTitle,
          condition: (answers) => {
            const { applicationReason } = getApplicationAnswers(answers)

            return applicationReason.includes(
              ApplicationReason.ASSISTED_CARE_AT_HOME,
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
      ],
    }),
    buildSection({
      id: 'additionalInfo',
      title: pensionSupplementFormMessage.additionalInfo.section,
      children: [],
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
