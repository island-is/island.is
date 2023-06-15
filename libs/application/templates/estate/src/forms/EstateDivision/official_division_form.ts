import {
  buildCheckboxField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { YES } from '../../lib/constants'

/* This form is being used for "Opinber skipti" */
export const form: Form = buildForm({
  id: 'officialDivisionOfEstate',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'overviewDivisionOfEstate',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overviewDivisionOfEstate',
          title: m.overviewTitle,
          description: m.overviewSubtitleDivisionOfEstate,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'deceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
              marginBottom: 2,
              space: 'gutter',
            }),
            ...deceasedInfoFields,
            buildDescriptionField({
              id: 'space0',
              title: '',
              space: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'confirmAction',
              title: '',
              large: true,
              backgroundColor: 'blue',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.divisionOfEstateConfirmActionCheckbox.defaultMessage,
                },
              ],
            }),
            buildSubmitField({
              id: 'officialDivisionForm.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
