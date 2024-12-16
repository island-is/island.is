import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const conditionsSubsection = buildSubSection({
  id: 'conditionsSubsection',
  title: 'Conditions',
  children: [
    buildMultiField({
      id: 'conditionsMultiField',
      title: 'Conditions',
      children: [
        buildDescriptionField({
          id: 'conditionsDescription',
          title: '',
          description:
            'Hægt er að skilyrða bæði staka reiti og texta eða heil section/subsection',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'conditionsDescription2',
          title: '',
          description: m.conditionsDescription2,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'conditionsDescription3',
          title: '',
          description:
            'Birting á hverju sem er getur því verið háð svörum frá notanda í umsókninni eða eftir utanaðkomandi gögnum sem eru sótt og sett í external data',
          marginBottom: 2,
        }),
        buildCheckboxField({
          id: 'conditionsCheckbox',
          title: 'Skilyrði fyrir staka reiti',
          options: [
            {
              label: 'Hakaðu í þetta box til að sjá auka reit bistast',
              value: YES,
            },
          ],
        }),
        buildTextField({
          condition: (answers) => {
            const checkboxValue = getValueViaPath<Array<string>>(
              answers,
              'conditionsCheckbox',
            )

            return checkboxValue ? checkboxValue[0] === YES : false
          },
          id: 'conditionsTextField',
          variant: 'textarea',
          rows: 8,
          title: 'Þessi reitur er bara í boði ef hakað er í boxið hér að ofan',
        }),
        buildCheckboxField({
          id: 'conditions2Checkbox',
          title: 'Skilyrði fyrir section/subsection',
          options: [
            {
              label:
                'Hakaðu í þetta box til að sjá nýtt subsection birtast í stepper ------>',
              value: YES,
            },
          ],
        }),
        buildHiddenInput({
          // This is a bit of a hack, but in order for the stepper to update and show the conditionally added step, there
          // has to be a field on the current step with a matching condition.
          condition: (answers) => {
            const checkboxValue = getValueViaPath<Array<string>>(
              answers,
              'conditions2Checkbox',
            )

            return checkboxValue ? checkboxValue[0] === YES : false
          },
          id: 'conditionsTextField',
        }),
      ],
    }),
  ],
})
