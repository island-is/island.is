import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildForm,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { mainForm } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  title: mainForm.title,
  logo: DirectorateOfLabourLogo,
  children: [
    buildMultiField({
      id: 'mainFormMultiField',
      children: [
        buildDescriptionField({
          id: 'dateDescription',
          title: mainForm.dateTitle,
        }),
        buildFieldsRepeaterField({
          id: 'dates',
          title: mainForm.dateTitle,
          addItemButtonText: mainForm.addDateButtonLabel,
          fields: {
            from: {
              component: 'date',
              label: mainForm.dateFrom,
              width: 'half',
              required: true,
            },
            to: {
              component: 'date',
              label: mainForm.dateTo,
              width: 'half',
              required: true,
            },
          },
        }),

        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: mainForm.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
