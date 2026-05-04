import {
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTableRepeaterField,
  coreMessages,
} from '@island.is/application/core'
import { confirmation } from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const confirmationSection = buildSection({
  id: 'confirmationSection',
  title: confirmation.sectionStepTitle,
  children: [
    buildMultiField({
      id: 'confirmationMultiField',
      title: confirmation.sectionTitle,
      description: confirmation.multiFieldDescription,
      children: [
        buildTableRepeaterField({
          id: 'jobSearchItems',
          title: confirmation.tableTitle,
          addItemButtonText: confirmation.addItemButtonText,
          saveItemButtonText: confirmation.saveItemButtonText,
          removeButtonTooltipText: confirmation.removeButtonTooltipText,
          fields: {
            companyName: {
              component: 'input',
              label: confirmation.companyNameLabel,
              width: 'full',
              required: true,
            },
          },
          table: {
            header: [confirmation.companyNameLabel],
          },
        }),
        buildSubmitField({
          id: 'confirmationSubmit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: coreMessages.buttonNext,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
