import {
  buildAlertMessageField,
  buildDateField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { accident, sections, shared } from '../../../lib/messages'
import { NO, YES } from '@island.is/application/types'

export const aboutSection = buildSubSection({
  id: 'about',
  title: sections.draft.about,
  children: [
    buildMultiField({
      title: accident.about.pageTitle,
      description: accident.about.description,
      children: [
        buildDescriptionField({
          id: 'about.description',
          titleVariant: 'h5',
          title: accident.about.informationHeading,
        }),
        buildDateField({
          id: 'about.date',
          title: accident.about.date,
          width: 'half',
        }),
        buildDateField({
          // TODO Replace me with some Time field
          id: 'about.time',
          title: accident.about.time,
          width: 'half',
        }),
        buildSelectField({
          id: 'about.didAoshCome',
          title: accident.about.didAoshCome,
          width: 'half',
          required: true,
          options: [
            {
              value: YES, // TODO What format does aosh use for yes/no options
              label: shared.options.yes,
            },
            {
              value: NO, // TODO What format does aosh use for yes/no options
              label: shared.options.no,
            },
          ],
        }),
        buildSelectField({
          id: 'about.didPoliceCome',
          title: accident.about.didPoliceCome,
          width: 'half',
          required: true,
          options: [
            {
              value: YES, // TODO What format does aosh use for yes/no options
              label: shared.options.yes,
            },
            {
              value: NO, // TODO What format does aosh use for yes/no options
              label: shared.options.no,
            },
          ],
        }),
        buildSelectField({
          id: 'about.municipality',
          title: accident.about.municipality,
          width: 'half',
          options: [],
        }),
        buildTextField({
          id: 'about.exactLocation',
          title: accident.about.exactLocation,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'about.describe.descriptionHeading',
          titleVariant: 'h5',
          title: accident.about.describeHeading,
          marginTop: 3,
        }),
        buildDescriptionField({
          id: 'about.describe.description',
          title: '',
          description: accident.about.describeDescription,
          marginTop: 3,
          marginBottom: 2,
        }),
        buildAlertMessageField({
          id: 'about.alertMessage',
          title: accident.about.alertFieldTitle,
          message: accident.about.alertFieldDescription,
          alertType: 'warning',
        }),
        buildTextField({
          id: 'about.wasDoing',
          title: accident.about.wasDoingTitle,
          variant: 'textarea',
          placeholder: accident.about.wasDoingPlaceholder,
          rows: 7,
        }),
        buildTextField({
          id: 'about.wentWrong',
          title: accident.about.wentWrongTitle,
          variant: 'textarea',
          placeholder: accident.about.wenWrongPlaceholder,
          rows: 7,
        }),
        buildTextField({
          id: 'about.how',
          title: accident.about.howTitle,
          variant: 'textarea',
          placeholder: accident.about.howPlaceholder,
          rows: 7,
        }),
        buildDescriptionField({
          id: 'about.describe.locationOfAccidentHeading',
          titleVariant: 'h5',
          title: accident.about.locationOfAccidentHeading,
          marginTop: 3,
        }),
      ],
    }),
  ],
})
