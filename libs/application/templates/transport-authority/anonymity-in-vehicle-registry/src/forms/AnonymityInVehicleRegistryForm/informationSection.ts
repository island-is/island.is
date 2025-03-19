import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildSection,
  buildDescriptionField,
  buildCheckboxField,
  YES,
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
              subLabel: information.labels.anonymityStatus.checkboxSubTitle,
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
          description: information.labels.anonymityStatus.noteText1,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText2',
          description: information.labels.anonymityStatus.noteText2,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText3',
          description: information.labels.anonymityStatus.noteText3,
          space: 1,
        }),
        buildDescriptionField({
          id: 'anonymityStatus.noteText4',
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
