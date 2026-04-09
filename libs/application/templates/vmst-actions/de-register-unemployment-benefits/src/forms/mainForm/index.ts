import {
  buildDateField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { mainForm } from '../../lib/messages'
import { Reasons } from '../../utils/constants'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'deregisterMultiField',
      title: mainForm.general.title,
      description: mainForm.general.description,
      children: [
        buildDescriptionField({
          id: 'description',
          title: mainForm.deregistrationDate.deregistrationDateTitle,
          titleVariant: 'h4',
        }),
        buildDateField({
          id: 'deregistrationDate',
          title: mainForm.deregistrationDate.deregistrationDateLabel,
          placeholder:
            mainForm.deregistrationDate.deregistrationDatePlaceholder,
          required: true,
          defaultValue: '',
          marginBottom: 'gutter',
        }),
        buildRadioField({
          id: 'reason',
          title: mainForm.reason.title,
          options: [
            {
              value: Reasons.MOVING_COUNTRIES,
              label: mainForm.reason.movingCountries,
            },
            { value: Reasons.EDUCATION, label: mainForm.reason.education },
            { value: Reasons.FOUND_JOB, label: mainForm.reason.foundJob },
            {
              value: Reasons.MATERNITY_LEAVE,
              label: mainForm.reason.maternityLeave,
            },
            { value: Reasons.CANCELLED, label: mainForm.reason.cancelled },
            { value: Reasons.UNABLE, label: mainForm.reason.unable },
            { value: Reasons.OTHER, label: mainForm.reason.other },
          ],
          required: true,
        }),
        buildTextField({
          id: 'otherReason',
          title: mainForm.reason.otherReasonTitle,
          variant: 'textarea',
          required: true,
          condition: (formValue) => formValue.reason === Reasons.OTHER,
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: mainForm.general.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
