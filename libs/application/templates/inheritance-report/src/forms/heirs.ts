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
import { InheritanceReport } from '../lib/dataSchema'
import { m } from '../lib/messages'

export const heirs = buildSection({
  id: 'heirs',
  title: m.propertyForExchangeAndHeirs,
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
              display: 'flex',
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
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(Number(answers.totalDeduction ?? '0'))),
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              display: 'flex',
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
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewNetProperty',
              title: m.netProperty,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.netProperty,
              display: 'flex',
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
              display: 'flex',
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
              display: 'flex',
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
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewHeirsTitle',
              title: m.heirs,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildCustomField({
              title: '',
              id: 'overviewHeirs',
              doesNotRequireAnswer: true,
              component: 'HeirsOverview',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewTotalInheritance',
              title: m.overviewTotalInheritance,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.heirsInheritanceRate,
              display: 'flex',
              value: ({ answers }) =>
                String((answers as InheritanceReport)?.heirs?.total) + ' %',
            }),
            buildDescriptionField({
              id: 'heirs_space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceAmount,
              display: 'flex',
              value: ({ answers }) => {
                let total = 0
                total += ((answers as InheritanceReport)?.heirs?.data?.map(
                  (heir: any) => heir.inheritance,
                ) as unknown) as number
                return formatCurrency(String(total))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space2',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.taxFreeInheritance,
              display: 'flex',
              value: ({ answers }) => {
                let total = 0
                total += ((answers as InheritanceReport)?.heirs?.data?.map(
                  (heir: any) => heir.taxFreeInheritance,
                ) as unknown) as number
                return formatCurrency(String(total))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space3',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.taxableInheritance,
              display: 'flex',
              value: ({ answers }) => {
                let total = 0
                total += ((answers as InheritanceReport)?.heirs?.data?.map(
                  (heir: any) => heir.taxableInheritance,
                ) as unknown) as number
                return formatCurrency(String(total))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space4',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceAmount,
              display: 'flex',
              value: ({ answers }) => {
                let total = 0
                total += ((answers as InheritanceReport)?.heirs?.data?.map(
                  (heir: any) => heir.inheritanceTax,
                ) as unknown) as number
                return formatCurrency(String(total))
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewAdditionalInfo',
              title: m.heirAdditionalInfo,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
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
            buildCustomField({
              title: '',
              id: 'overviewPrint',
              doesNotRequireAnswer: true,
              component: 'PrintScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
