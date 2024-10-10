import {
  buildDescriptionField,
  buildMultiField,
  buildCheckboxField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const approvePrivateDivisionSubmission = buildSection({
  id: 'approveSubmission',
  title: m.divisionOfEstateByHeirsTerms,
  children: [
    buildMultiField({
      id: 'approveSubmission',
      title: m.divisionOfEstateByHeirsTerms,
      description: m.divisionOfEstateByHeirsText,
      children: [
        buildDescriptionField({
          id: 'spaceSubmission',
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
              label: m.divisionOfEstateByHeirsSubmissionCheckbox,
            },
          ],
        }),
      ],
    }),
  ],
})
