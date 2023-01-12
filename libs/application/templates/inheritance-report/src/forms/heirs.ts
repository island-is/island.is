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
              id: 'temp1',
              title: '',
              space: 'gutter',
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
