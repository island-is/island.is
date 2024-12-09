import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'
import { examCategories } from '../../../lib/messages'
import { getExaminees } from '../../../utils'

export const ExamCategoriesSection = buildSection({
  id: 'examCategoriesSection',
  title: examCategories.general.sectionTitle,
  children: [
    buildMultiField({
      title: examCategories.general.pageTitle,
      description: examCategories.general.pageDescription,
      id: 'examCategoriesMultiField',
      children: [
        // buildStaticTableField({
        //   title: '',
        //   header: [
        //     'Nafn',
        //     'Kennitala',
        //     'Netfang',
        //     'Símanúmer',
        //     'Ökursk.nr.',
        //     'Útgáfuland',
        //   ],
        //   rows: ({ answers, externalData }) =>
        //     getExaminees(
        //       answers as unknown,
        //       externalData,
        //     ),
        // }),
        buildCustomField({
          id: '',
          title: '',
          component: 'ExamCategories',
        }),
      ],
    }),
  ],
})
