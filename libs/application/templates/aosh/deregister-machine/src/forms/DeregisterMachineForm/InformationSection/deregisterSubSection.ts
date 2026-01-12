import {
  buildDateField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { deregister } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import { Status } from '../../../shared'

export const deregisterSubSection = buildSubSection({
  id: 'deregisterSubSection',
  title: deregister.general.title,
  children: [
    buildMultiField({
      id: 'deregister',
      title: deregister.general.title,
      description: deregister.general.description,
      children: [
        buildDateField({
          id: 'deregister.date',
          title: deregister.labels.date,
          width: 'half',
          required: true,
          minDate: new Date(),
        }),
        buildRadioField({
          id: 'deregister.status',
          width: 'half',
          defaultValue: Status.TEMPORARY,
          options: [
            {
              value: Status.TEMPORARY,
              label: deregister.labels.temporary,
              tooltip: deregister.labels.temporaryDescription,
            },
            {
              value: Status.PERMANENT,
              label: deregister.labels.permanent,
              tooltip: deregister.labels.permanentDescription,
            },
          ],
        }),
        buildTextField({
          id: 'deregister.fateOfMachine',
          title: deregister.labels.fateOfMachine,
          width: 'full',
          variant: 'textarea',
          required: true,
          rows: 5,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: deregister.labels.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: deregister.labels.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
