import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildTextField,
  buildSection,
  buildSubSection,
  buildDescriptionField,
  buildCheckboxField,
  YES,
  NO,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { information } from '../../lib/messages'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'anonymityStatusMultiField',
      title: information.labels.anonymityStatus.pageTitle,
      children: [
        buildCheckboxField({
          id: 'isChecked',
          title: '',
          large: true,
          backgroundColor: 'white',
          defaultValue: (application: Application) =>
            application.externalData?.anonymityStatus?.data?.isChecked
              ? [YES]
              : [],
          options: [
            {
              value: YES,
              label: information.labels.anonymityStatus.checkboxTitle,
              subLabel:
                information.labels.anonymityStatus.checkboxSubTitle
                  .defaultMessage,
            },
          ],
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteTitle',
          title: information.labels.anonymityStatus.noteTitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText1',
          title: '',
          description: information.labels.anonymityStatus.noteText1,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText2',
          title: '',
          description: information.labels.anonymityStatus.noteText2,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText3',
          title: '',
          description: information.labels.anonymityStatus.noteText3,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText4',
          title: '',
          description: information.labels.anonymityStatus.noteText4,
          space: 1,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: information.confirmation.confirm,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: information.confirmation.confirm,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
