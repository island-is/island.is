import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { YES } from '../../lib/constants'
import { m } from '../../lib/messages'

export const prePaidHeirs = buildSection({
  id: 'prePaidHeirs',
  title: 'Erfingjar',
  children: [
    buildMultiField({
      id: 'heirs',
      title: 'Hver á að fá arfinn?',
      children: [
        buildDescriptionField({
          id: 'description',
          title: '',
          description: 'Lorem ipsum foo bar beep boop meep morp',
          marginBottom: 'p4',
        }),
        buildCustomField(
          {
            title: '',
            id: 'heirs.data',
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
                title: m.inheritanceAmount,
                id: 'inheritance',
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
