import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { examCategories } from '../../../lib/messages'

export const examCategoriesSection = buildSection({
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
          id: 'examCategory',
          title: '',
          component: 'ExamCategories',
        }),
      ],
    }),
  ],
})
