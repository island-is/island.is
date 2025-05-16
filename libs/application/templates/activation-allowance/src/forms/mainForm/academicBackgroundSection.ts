import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSection,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { academicBackground } from '../../lib/messages'

export const academicBackgroundSection = buildSection({
  id: 'academicBackgroundSection',
  title: academicBackground.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentInformationMultiField',
      title: academicBackground.general.pageTitle,
      description: academicBackground.general.description,
      children: [
        buildDescriptionField({
          id: 'academicBackground.areYouStudyingDescription',
          title: academicBackground.labels.areYouStudying,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildRadioField({
          id: 'academicBackground.areYouStudying',
          marginBottom: 2,
          space: 0,
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'academicBackground.educationDescription',
          title: academicBackground.labels.educationTitle,
          description: academicBackground.labels.educationDescription,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildFieldsRepeaterField({
          id: 'academicBackground',
          titleVariant: 'h5',
          marginTop: 0,
          minRows: 0,
          formTitleNumbering: 'none',
          addItemButtonText: academicBackground.labels.addEducationButton,
          fields: {
            school: {
              component: 'input',
              width: 'half',
              label: academicBackground.labels.school,
            },
            subject: {
              component: 'input',
              label: academicBackground.labels.subject,
              width: 'half',
            },
            units: {
              component: 'input',
              label: academicBackground.labels.units,
              width: 'half',
              type: 'number',
            },
            degree: {
              component: 'input',
              label: academicBackground.labels.degree,
              width: 'half',
            },
            endOfStudies: {
              component: 'date',
              label: academicBackground.labels.endOfStudies,
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
