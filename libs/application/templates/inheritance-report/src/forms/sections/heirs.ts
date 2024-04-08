import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { InheritanceReport } from '../../lib/dataSchema'
import { m } from '../../lib/messages'
import { roundedValueToNumber, valueToNumber } from '../../lib/utils/helpers'
import { YES } from '../../lib/constants'

export const heirs = buildSection({
  id: 'heirs',
  title: m.propertyForExchangeAndHeirs,
  children: [
    buildSubSection({
      id: 'propertyForExchange',
      title: m.propertyForExchangeAlternative,
      children: [
        buildMultiField({
          id: 'propertyForExchange',
          title: m.propertyForExchangeAlternative,
          description: m.assetsToShareDescription,
          children: [
            buildDescriptionField({
              id: 'total',
              title: '',
            }),
            buildDescriptionField({
              id: 'debtsTotal',
              title: '',
            }),
            buildDescriptionField({
              id: 'shareTotal',
              title: '',
            }),
            buildDescriptionField({
              id: 'netTotal',
              title: '',
            }),
            buildDescriptionField({
              id: 'spouseTotal',
              title: '',
            }),
            buildDescriptionField({
              id: 'estateTotal',
              title: '',
            }),
            buildDescriptionField({
              id: 'netPropertyForExchange',
              title: '',
            }),
            buildDescriptionField({
              id: 'customSpouseSharePercentage',
              title: '',
            }),
            buildCheckboxField({
              id: 'hasCustomSpouseSharePercentage',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.assetsToShareHasCustomSpousePercentage,
                },
              ],
            }),
            // buildTextField({
            //   id: 'customSpouseSharePercentage',
            //   title: m.assetsToShareCustomSpousePercentage,
            //   width: 'half',
            //   condition: (answers) =>
            //     !!getValueViaPath<string[]>(
            //       answers,
            //       'hasCustomSpouseSharePercentage',
            //     )?.includes(YES),
            // }),
            buildCustomField({
              title: '',
              id: 'share',
              doesNotRequireAnswer: true,
              component: 'CalculateShare',
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
            buildDescriptionField({
              id: 'heirs.hasModified',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'heirs.data',
                doesNotRequireAnswer: true,
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
    }),
    buildSubSection({
      id: 'heirsAdditionalInfo',
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
                    roundedValueToNumber(
                      getValueViaPath<number>(answers, 'netTotal'),
                    ),
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
                formatCurrency(
                  String(
                    roundedValueToNumber(
                      getValueViaPath<number>(answers, 'spouseTotal'),
                    ),
                  ),
                ),
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.netPropertyForExchange,
              display: 'flex',
              value: ({ answers }) => {
                return formatCurrency(
                  String(
                    roundedValueToNumber(
                      getValueViaPath<number>(
                        answers,
                        'netPropertyForExchange',
                      ),
                    ),
                  ),
                )
              },
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
                String(getValueViaPath<number>(answers, 'heirs.total')),
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
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.inheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
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
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.taxFreeInheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
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
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.taxableInheritance),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
              },
            }),
            buildDescriptionField({
              id: 'heirs_space4',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.inheritanceTax,
              display: 'flex',
              value: ({ answers }) => {
                const total = (
                  answers as InheritanceReport
                )?.heirs?.data?.reduce(
                  (sum, heir) => sum + valueToNumber(heir.inheritanceTax),
                  0,
                )

                return formatCurrency(String(total ?? '0'))
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
              value: ({ answers }) =>
                getValueViaPath<string>(answers, 'heirsAdditionalInfo'),
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
