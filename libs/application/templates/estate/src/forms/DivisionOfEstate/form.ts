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

export const form: Form = buildForm({
  id: 'divisionOfEstate',
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
            }),
            ...deceasedInfoFields,
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveSubmission',
      title: m.divisionOfEstateTerms,
      children: [
        buildMultiField({
          id: 'approveSubmission',
          title: m.divisionOfEstateTerms,
          description: m.divisionOfEstateTermsText,
          children: [
            buildCheckboxField({
              id: 'readTerms',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.divisionOfEstateSubmissionCheckbox.defaultMessage,
                },
              ],
            }),
            buildSubmitField({
              id: 'divisionOfEstateByHeirs.submit',
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
