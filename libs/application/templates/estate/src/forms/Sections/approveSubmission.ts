import {
  buildDescriptionField,
  buildMultiField,
  buildCheckboxField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { YES } from '../../lib/constants'

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
