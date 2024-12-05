import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { examinee, shared } from '../../../lib/messages'

export const examineeSection = buildSection({
  id: 'examineeSection',
  title: examinee.general.sectionTitle,
  children: [
    buildMultiField({
      title: examinee.general.pageTitle,
      id: 'examinees',
      description: examinee.general.pageDescription,
      children: [
        buildTableRepeaterField({
          id: 'examinees',
          title: '',
          fields: {
            nationlId: {
              component: 'input',
              label: shared.labels.ssn,
              width: 'half',
              format: '######-####',
            },
          },
        }),
      ],
    }),
  ],
})
