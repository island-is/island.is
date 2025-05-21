import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { jobWishes } from '../../lib/messages'

export const jobWishesSection = buildSection({
  id: 'jobWishesSection',
  title: jobWishes.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobWishesMultiField',
      title: jobWishes.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'jobWishes.description',
          title: jobWishes.labels.whatKindOfJob,
          description: jobWishes.labels.escoInfo,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildSelectField({
          id: 'jobWishes.jobs',
          title: jobWishes.labels.jobs,
          isMulti: true,
          options: [
            // TODO: get from API
            { value: 'option1', label: 'Veitingastörf' },
            { value: 'option2', label: 'Skrifstofustarf' },
            { value: 'option3', label: 'Þjónustustörf' },
          ],
        }),
      ],
    }),
  ],
})
