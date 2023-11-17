import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '../assets/Logo'
import { survivorsBenefitsFormMessage } from '../lib/messages'
import { FILE_SIZE_LIMIT } from '../lib/constants'

export const SurvivorsBenefitsForm: Form = buildForm({
  id: 'SurvivorsBenefitsDraft',
  title: survivorsBenefitsFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: survivorsBenefitsFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'infoSection',
      title: survivorsBenefitsFormMessage.info.section,
      children: [
        buildSubSection({
          id: 'deceasedSpouse',
          title: survivorsBenefitsFormMessage.info.deceasedSpouseSubSection,
          children: [
            buildMultiField({
              id: 'deceasedSpouseInfo',
              title: survivorsBenefitsFormMessage.info.deceasedSpouseTitle,
              description:
                survivorsBenefitsFormMessage.info.deceasedSpouseDescription,
              children: [
                buildTextField({
                  id: 'deceasedSpouseInfo.name',
                  title: survivorsBenefitsFormMessage.info.deceasedSpouseName,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: survivorsBenefitsFormMessage.comment.additionalInfoTitle,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: survivorsBenefitsFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title: survivorsBenefitsFormMessage.fileUpload.additionalFileTitle,
              description:
                survivorsBenefitsFormMessage.fileUpload.additionalFileDescription,
              introduction:
                survivorsBenefitsFormMessage.fileUpload.additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                survivorsBenefitsFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                survivorsBenefitsFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                survivorsBenefitsFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                survivorsBenefitsFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: survivorsBenefitsFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: survivorsBenefitsFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description: survivorsBenefitsFormMessage.comment.description,
              placeholder: survivorsBenefitsFormMessage.comment.placeholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: survivorsBenefitsFormMessage.confirm.section,
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
                    title: survivorsBenefitsFormMessage.confirm.title,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
