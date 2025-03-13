import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { examCategories } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'
import { SelfOrOthers } from '../../../utils/types'

export const examCategoriesSectionSelf = buildSection({
  id: 'examCategoriesSectionSelf',
  title: examCategories.general.sectionTitle,
  condition: (answers: FormValue) => {
    const selfOrOthers = getValueViaPath<SelfOrOthers>(answers, 'information.selfOrOthers')
    return selfOrOthers === SelfOrOthers.self ? true : false
  },
  children: [
    buildMultiField({
      title: examCategories.general.pageTitle,
      description: examCategories.general.pageDescription,
      id: 'examCategoriesMultiField',
      children: [
        buildTextField({
          id: '',
        })
      ],
    }),
  ],
})
