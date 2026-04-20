import { buildSection } from '@island.is/application/core'
import {
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ApplicantType } from '../../shared/constants'
import { buildFileUploadField } from '@island.is/application/core'
import * as m from '../../lib/messages'

export const educationalConfirmationSection = buildSection({
  id: 'educationConfirmationSection',
  title: m.application.educationConfirmation.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationConfirmaitonMultifield',
      title: m.application.educationConfirmation.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'educationConfirmationDescriptionField',
          description: m.application.educationConfirmation.SectionDescription,
        }),
        buildFileUploadField({
          id: 'educationConfirmationFileUploadField',
          title: m.application.educationConfirmation.UploadFieldTitle,
          uploadDescription:
            m.application.educationConfirmation.UploadFieldDescription,
          uploadAccept: '.pdf, .docx, .rtf',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
  condition: (answers: FormValue) =>
    answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
})
