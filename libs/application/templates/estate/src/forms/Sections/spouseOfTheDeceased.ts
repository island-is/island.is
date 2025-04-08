import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import { JA, YES, NEI, NO } from '../../lib/constants'
import { deceasedInfoFields } from './deceasedInfoFields'
import { m } from '../../lib/messages'

export const spouseOfTheDeceased = buildSection({
  id: 'spouseOfTheDeceased',
  title: m.theDeceased,
  children: [
    buildMultiField({
      id: 'deceased',
      title: m.theDeceased,
      children: [
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'spaceSpouseO',
          space: 'containerGutter',
        }),
        buildRadioField({
          id: 'deceasedWithUndividedEstate.selection',
          title: m.isDeceasedWithUndividedEstate,
          width: 'half',
          largeButtons: false,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
        buildDescriptionField({
          id: 'spouseOfTheDeceased',
          space: 'containerGutter',
          title: m.spouseOfTheDeceased,
          titleVariant: 'h4',
          marginBottom: 2,
          condition: (answers) =>
            getValueViaPath(
              answers,
              'deceasedWithUndividedEstate.selection',
            ) === YES,
        }),
        buildCustomField(
          {
            id: 'deceasedWithUndividedEstate.spouse',
            component: 'LookupPerson',
            condition: (answers) =>
              getValueViaPath(
                answers,
                'deceasedWithUndividedEstate.selection',
              ) === YES,
          },
          {
            useDeceasedRegistry: true,
          },
        ),
      ],
    }),
  ],
})
