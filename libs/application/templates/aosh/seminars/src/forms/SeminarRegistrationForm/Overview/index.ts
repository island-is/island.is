import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
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
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
        // buildStaticTableField({
        //   title: '',
        //   header: ['Nafn þátttakanda', 'Kennitala', 'Netfang', 'Símanúmer'],
        //   rows: [
        //     [
        //       'Notandi Jóns',
        //       '012345-6789',
        //       'notandijons@famemail.com',
        //       '666 8999',
        //     ],
        //     [
        //       'Þátttakandi 1 Jóns',
        //       '012345-6789',
        //       'thatttakandi1@email.co',
        //       '666 8999',
        //     ],
        //     [
        //       'Þátttakandi 2 Jóns',
        //       '012345-6789',
        //       'thatttakandi2@email.co',
        //       '666 8999',
        //     ],
        //   ],
        // }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.general.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
