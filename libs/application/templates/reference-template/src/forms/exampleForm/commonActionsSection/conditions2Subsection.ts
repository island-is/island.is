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
  title: 'Þetta section er skilyrt',
  children: [
    buildDescriptionField({
      id: 'condition2Description',
      title: 'Þessi skjár sést byggt á fyrri svörum',
      description:
        'Með þessari virkni getur umsóknin greinst í sundur og safnað mismunandi gögnum fyrir mismunandi svör notenda',
    }),
  ],
})
