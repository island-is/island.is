import {
  buildDescriptionField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'

export const conditions2Section = buildSection({
  condition: (answers) => {
    const checkbox2Value = getValueViaPath<Array<string>>(
      answers,
      'conditions2Checkbox',
    )

    return checkbox2Value ? checkbox2Value[0] === YES : false
  },
  id: 'condition2Subsection',
  title: 'This section is conditional',
  children: [
    buildDescriptionField({
      id: 'condition2Description',
      title: 'This screens visibility is based in previous answers',
      description:
        'With this functionality, the application can branch and collect different data for different users',
    }),
  ],
})
