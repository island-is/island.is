import {
  buildDateField,
  buildDescriptionField,
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
      title: mainForm.title,
      description: mainForm.description,
      children: [
        buildDescriptionField({
          id: 'dateDescription',
          title: mainForm.dateTitle,
          titleVariant: 'h5',
        }),
        buildDateField({
          id: 'date.from',
          title: mainForm.dateFrom,
          placeholder: mainForm.datePlaceholder,
          width: 'half',
          required: true,
        }),
        buildDateField({
          id: 'date.to',
          title: mainForm.dateTo,
          placeholder: mainForm.datePlaceholder,
          width: 'half',
          required: true,
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
