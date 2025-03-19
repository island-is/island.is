import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { examCategories } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import { getExaminees } from '../../../utils'
import { SelfOrOthers } from '../../../utils/enums'

export const examCategoriesSectionOthers = buildSection({
  id: 'examCategoriesSectionOthers',
  title: examCategories.general.sectionTitle,
  condition: (answers: FormValue) => {
    const selfOrOthers = getValueViaPath<SelfOrOthers>(
      answers,
      'information.selfOrOthers',
    )
    return selfOrOthers === SelfOrOthers.others ? true : false
  },
  children: [
    buildMultiField({
      title: examCategories.general.pageTitle,
      description: examCategories.general.pageDescription,
      id: 'examCategoriesMultiField',
      children: [
        buildStaticTableField({
          title: '',
          header: [
            'Nafn',
            'Kennitala',
            'Netfang',
            'Símanúmer',
            'Ökursk.nr.',
            'Útgáfuland',
          ],
          rows: ({ answers, externalData }) =>
            getExaminees(answers as unknown, externalData),
        }),
        buildCustomField({
          id: 'examCategory',
          title: '',
          component: 'ExamCategories',
        }),
      ],
    }),
  ],
})
