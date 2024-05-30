import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const prePaidHeirs = buildSection({
  id: 'prePaidHeirs',
  title: 'Erfingjar',
  children: [
    buildMultiField({
      id: 'prePaidHeirs',
      title: m.heirsTitlePrePaid,
      description: m.heirsDescriptionPrePaid,
      children: [
        buildCustomField(
          {
            title: '',
            id: 'prePaidHeirs.data',
            doesNotRequireAnswer: false,
            component: 'HeirsAndPartitionRepeater',
          },
          {
            customFields: [
              {
                title: m.heirsRelation,
                id: 'relation',
              },
              {
                title: m.heirsInheritanceRate,
                id: 'heirsPercentage',
              },
              {
                title: m.taxFreeInheritance,
                id: 'taxFreeInheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.taxableInheritance,
                id: 'taxableInheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.inheritanceAmount,
                id: 'inheritance',
                readOnly: true,
                currency: true,
              },
              {
                title: m.inheritanceTax,
                id: 'inheritanceTax',
                readOnly: true,
                currency: true,
              },
            ],
            repeaterButtonText: m.addHeir,
            sumField: 'heirsPercentage',
          },
        ),
      ],
    }),
  ],
})
