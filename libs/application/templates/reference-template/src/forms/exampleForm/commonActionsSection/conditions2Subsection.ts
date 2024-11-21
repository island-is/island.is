import {
  buildDescriptionField,
  buildSubSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'

export const conditions2Subsection = buildSubSection({
  condition: (answers) => {
    const checkbox2Value = getValueViaPath<Array<string>>(
      answers,
      'conditions2Checkbox',
    )

    return checkbox2Value ? checkbox2Value[0] === YES : false
  },
  id: 'condition2Subsection',
  title: 'This shows on condition',
  children: [
    buildDescriptionField({
      id: 'condition2Description',
      title: 'This is shown based on previous answers',
      description:
        'This way you can make your form branch depending on different scenarios, get extra information and so on',
    }),
  ],
})
