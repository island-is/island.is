import {
  buildDateField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { mainForm } from '../../lib/messages'
import { GaldurExternalDomainModelsSupportDataDelistingReasonDTO } from '@island.is/clients/vmst-unemployment'

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
          options: (application, _, locale) => {
            const reasons = getValueViaPath<
              Array<GaldurExternalDomainModelsSupportDataDelistingReasonDTO>
            >(application.externalData, 'supportData.data.delistingReasons', [])

            return (
              reasons?.map((reason) => ({
                value: reason.id || '',
                label:
                  locale === 'is'
                    ? reason.name || ''
                    : reason.english || reason.name || '',
              })) || []
            )
          },
          required: true,
        }),
        buildTextField({
          id: 'otherReason',
          title: mainForm.reason.otherReasonTitle,
          variant: 'textarea',
          required: true,
          condition: (formValue) =>
            formValue.reason === 'e39681d9-f953-46b1-aff9-08d7f72f9c0e', //this is the id of other reasons
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
