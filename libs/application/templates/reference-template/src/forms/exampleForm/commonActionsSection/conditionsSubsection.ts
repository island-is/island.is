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
          title: 'Conditional render',
          description:
            'Conditions can be used either on whole sections/subsections or individual field',
        }),
        buildCheckboxField({
          id: 'conditionsCheckbox',
          title: 'Conditions checkbox',
          options: [
            {
              label: 'Check this box to see additional fields',
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
          title: 'This field is only visible if the checkbox above is checked',
        }),
        buildCheckboxField({
          id: 'conditions2Checkbox',
          title: 'Condition for sections or subsections',
          options: [
            {
              label:
                'Check this box to see and extra subsection being added into the stepper ------>',
              value: YES,
            },
          ],
        }),
        buildTextField({
          condition: (answers) => {
            const checkboxValue = getValueViaPath<Array<string>>(
              answers,
              'conditions2Checkbox',
            )

            return checkboxValue ? checkboxValue[0] === YES : false
          },
          id: 'conditionsTextField',
          variant: 'textarea',
          rows: 8,
          title: 'Now you should see the next step in the stepper',
        }),
      ],
    }),
  ],
})
