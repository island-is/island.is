import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { examCategories } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import { SelfOrOthers } from '../../../utils/enums'

export const examCategoriesSectionSelf = buildSection({
  id: 'examCategoriesSectionSelf',
  title: examCategories.general.sectionTitle,
  condition: (answers: FormValue) => {
    const selfOrOthers = getValueViaPath<SelfOrOthers>(
      answers,
      'information.selfOrOthers',
    )
    return selfOrOthers === SelfOrOthers.self
  },
  children: [
    buildMultiField({
      title: examCategories.general.pageTitle,
      description: examCategories.general.pageDescription,
      id: 'examCategoriesMultiField',
      children: [
        buildHiddenInput({
          id: 'examCategoryTable',
        }),
        buildCustomField({
          id: 'examCategories',
          component: 'ExamCategoriesSelf',
        }),
      ],
    }),
  ],
})
