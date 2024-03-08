import {
  buildDateField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Status } from '../../../shared'
import { licencePlate } from '../../../lib/messages'

export const licencePlateSubSection = buildSubSection({
  id: 'licencePlateSubSection',
  title: licencePlate.general.title,
  children: [
    buildMultiField({
      id: 'licencePlate',
      title: licencePlate.general.title,
      description: licencePlate.general.description,
      children: [
        buildDateField({
          id: 'licencePlate.date',
          title: licencePlate.labels.date,
          width: 'half',
          required: true,
          minDate: new Date(),
        }),
        buildRadioField({
          id: 'licencePlate.status',
          title: '',
          width: 'half',
          defaultValue: Status.TEMPORARY,
          options: [
            {
              value: Status.TEMPORARY,
              label: licencePlate.labels.temporary,
              tooltip: licencePlate.labels.temporaryDescription,
            },
            {
              value: Status.PERMANENT,
              label: licencePlate.labels.permanent,
              tooltip: licencePlate.labels.permanentDescription,
            },
          ],
        }),
        buildTextField({
          id: 'licencePlate.fateOfMachine',
          title: licencePlate.labels.fateOfMachine,
          width: 'full',
          variant: 'textarea',
          required: true,
          rows: 5,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: licencePlate.labels.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: licencePlate.labels.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
