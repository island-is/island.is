import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        // TODO(balli) Change this out for built in overview field
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
        // buildSubmitField({
        //   id: 'submit',
        //   placement: 'footer',
        //   title: overview.general.approveButton,
        //   actions: [
        //     {
        //       event: DefaultEvents.PAYMENT,
        //       name: overview.general.approveButton,
        //       type: 'primary',
        //     },
        //   ],
        // }),
      ],
    }),
  ],
})
