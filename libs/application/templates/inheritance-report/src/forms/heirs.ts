import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../lib/messages'

export const heirs = buildSection({
  id: 'heirs',
  title: m.propertyForExchange,
  children: [
    buildSubSection({
      id: 'spouse',
      title: m.spousesShare,
      children: [
        buildMultiField({
          id: 'spouseRate',
          title: m.spousesShare,
          description: m.propertyForExchangeDescription,
          children: [
            buildTextField({
              id: 'totalDeduction',
              title: m.totalDeduction,
              width: 'half',
              variant: 'currency',
              defaultValue: '0',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'propertyForExchange',
      title: m.propertyForExchangeAndHeirs,
      children: [
        buildMultiField({
          id: 'propertyForExchange',
          title: m.propertyForExchange,
          children: [
            buildKeyValueField({
              label: m.netProperty,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    Number(answers.assetsTotal) -
                      Number(answers.debtsTotal) +
                      Number(answers.businessTotal),
                  ),
                ),
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalDeduction,
              value: ({ answers }) =>
                formatCurrency(String(Number(answers.totalDeduction ?? '0'))),
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    Number(answers.assetsTotal) -
                      Number(answers.debtsTotal) +
                      Number(answers.businessTotal) -
                      Number(answers.totalDeduction),
                  ),
                ),
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirs',
      title: m.heirsAndPartition,
      children: [
        buildMultiField({
          id: 'heirs',
          title: m.heirsAndPartition,
          description: m.heirsAndPartitionDescription,
          children: [
            buildDescriptionField({
              id: 'heirs.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'heirs.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.heirsNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.heirsName.defaultMessage,
                    id: 'heirsName',
                  },
                  {
                    title: m.heirsEmail.defaultMessage,
                    id: 'email',
                  },
                  {
                    title: m.heirsPhone.defaultMessage,
                    id: 'phone',
                    format: '###-####',
                  },
                  {
                    title: m.heirsRelation.defaultMessage,
                    id: 'relation',
                  },
                  {
                    title: m.heirsInheritanceRate.defaultMessage,
                    id: 'heirsPercentage',
                  },
                  {
                    title: m.taxFreeInheritance.defaultMessage,
                    id: 'taxFreeInheritance',
                    readOnly: true,
                  },
                  {
                    title: m.inheritanceAmount.defaultMessage,
                    id: 'inheritance',
                    readOnly: true,
                  },
                  {
                    title: m.taxableInheritance.defaultMessage,
                    id: 'taxableInheritance',
                    readOnly: true,
                  },
                  {
                    title: m.inheritanceTax.defaultMessage,
                    id: 'inheritanceTax',
                    readOnly: true,
                  },
                ],
                repeaterButtonText: m.addHeir.defaultMessage,
                repeaterHeaderText: m.heir.defaultMessage,
                sumField: 'heirsPercentage',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsAddintionalInfo',
      title: m.heirAdditionalInfo,
      children: [
        buildMultiField({
          id: 'heirsAdditionalInfo',
          title: m.heirAdditionalInfo,
          description: m.heirAdditionalInfoDescription,
          children: [
            buildTextField({
              id: 'heirsAdditionalInfo',
              title: m.info,
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'heirsOverview',
          title: m.overview,
          description: m.heirsOverviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewPropertyForExchange',
              title: m.propertyForExchange,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.netProperty,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    Number(answers.assetsTotal) -
                      Number(answers.debtsTotal) +
                      Number(answers.businessTotal),
                  ),
                ),
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalDeduction,
              value: ({ answers }) =>
                formatCurrency(String(Number(answers.totalDeduction ?? '0'))),
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    Number(answers.assetsTotal) -
                      Number(answers.debtsTotal) +
                      Number(answers.businessTotal) -
                      Number(answers.totalDeduction),
                  ),
                ),
            }),
            buildDescriptionField({
              id: 'space2',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildCustomField({
              title: '',
              id: 'heirsOverview',
              component: 'HeirsOverview',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewHeirsTotal',
              title: m.totalReconciliation,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.heirsInheritanceRate,
              value: ({ answers }) => {
                const sum = (answers.heirs as any).data.reduce(
                  (sum: number, heir: any) => {
                    return sum + Number(heir.heirsPercentage)
                  },
                  0,
                )

                return String(sum) + '%'
              },
              width: 'half',
            }),
            buildKeyValueField({
              label: m.inheritanceAmount,
              value: ({ answers }) => {
                const sum = (answers.heirs as any).data.reduce(
                  (sum: number, heir: any) => {
                    return sum + Number(heir.inheritance)
                  },
                  0,
                )

                return formatCurrency(String(sum))
              },
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space3',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.taxFreeInheritance,
              value: ({ answers }) => {
                const sum = (answers.heirs as any).data.reduce(
                  (sum: number, heir: any) => {
                    return sum + Number(heir.taxFreeInheritance)
                  },
                  0,
                )

                return formatCurrency(String(sum))
              },
              width: 'half',
            }),
            buildKeyValueField({
              label: m.taxableInheritance,
              value: ({ answers }) => {
                const sum = (answers.heirs as any).data.reduce(
                  (sum: number, heir: any) => {
                    return sum + Number(heir.taxableInheritance)
                  },
                  0,
                )

                return formatCurrency(String(sum))
              },
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space4',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceTax,
              value: ({ answers }) => {
                let sum = (answers.heirs as any).data.reduce(
                  (sum: number, heir: any) => {
                    return sum + Number(heir.inheritanceTax)
                  },
                  0,
                )

                sum = Number.parseInt(sum, 10)
                return formatCurrency(String(sum))
              },
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space5',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewHeirsAdditionalInfo',
              title: m.heirAdditionalInfo,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.info,
              value: ({ answers }) => answers.heirsAdditionalInfo as string,
            }),
            buildSubmitField({
              id: 'inheritanceReport.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitReport,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
