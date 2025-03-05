import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'

export const conditionsSection = buildSection({
  id: 'conditionsSubsection',
  title: 'Conditions',
  children: [
    buildMultiField({
      id: 'conditionsMultiField',
      title: 'Conditions',
      children: [
        buildDescriptionField({
          id: 'conditionsDescription',
          description:
            'It is possible to condition both single fields and text or an entire section/subsection',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'conditionsDescription2',
          description: 'asdf',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'conditionsDescription3',
          description:
            'The visibility of everything can be dependent on the users answers in the application or data that has been fetched and placed in externalData.',
          marginBottom: 2,
        }),
        buildCheckboxField({
          id: 'conditionsCheckbox',
          title: 'Skilyrði fyrir staka reiti',
          options: [
            {
              label: 'Check this box to see an extra field appear',
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
          title: 'This field is only available if the box above is checked',
        }),
        buildCheckboxField({
          id: 'conditions2Checkbox',
          title: 'Skilyrði fyrir section/subsection',
          options: [
            {
              label:
                'Check this box to see a new subsection appear in the stepper ------>',
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
          id: 'conditionsHiddenTextField',
        }),
      ],
    }),
  ],
})
