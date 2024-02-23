import {
  buildCheckboxField,
  buildDateField,
  buildDividerField,
  buildMultiField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { location, deregister } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

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
          colSpan: '1/2',
        }),
        buildCheckboxField({
          id: 'deregister.temporary',
          title: '',
          width: 'half',
          options: [
            {
              value: 'true',

              label: deregister.labels.temporary,
              tooltip: deregister.labels.temporaryDescription,
            },
            {
              value: 'true',
              label: deregister.labels.final,
              tooltip: deregister.labels.finalDescription,
            },
          ],
          //description: deregister.labels.temporaryDescription,
        }),
        buildCheckboxField({
          id: 'deregister.final',
          title: '',
          width: 'half',
          options: [
            {
              value: 'true',
              label: deregister.labels.final,
            },
          ],
          //description: deregister.labels.finalDescription,
        }),
        buildTextField({
          id: 'deregister.fateOfMachine',
          title: location.labels.moreInfoLabel,
          width: 'full',
          variant: 'textarea',
          required: false,
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: location.labels.approveButton,
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
