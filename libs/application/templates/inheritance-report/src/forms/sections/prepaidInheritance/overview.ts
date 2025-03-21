import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'
import { InheritanceReport } from '../../../lib/dataSchema'
import {
  roundedValueToNumber,
  showTaxFreeInOverview,
  valueToNumber,
} from '../../../lib/utils/helpers'
import { calculateTotalAssets } from '../../../lib/utils/calculateTotalAssets'

export const prepaidOverview = buildSubSection({
  id: 'prepaidOverview',
  title: m.overview,
  children: [
    buildMultiField({
      id: 'prepaidOverview',
      title: m.overviewHeirsTitle,
      description: m.overviewHeirsDescription,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewAssetsTitle',
          title: m.properties,
          titleVariant: 'h3',
          space: 'gutter',
          marginBottom: 'gutter',
        }),
        buildKeyValueField({
          label: m.netPropertyForExchange,
          display: 'flex',
          value: ({ answers }) =>
            formatCurrency(
              String(roundedValueToNumber(calculateTotalAssets(answers))),
            ),
        }),
        buildDescriptionField({
          id: 'space',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildCustomField({
          id: 'overviewHeirs',
          doesNotRequireAnswer: true,
          component: 'OverviewHeirs',
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
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.inheritanceAmount,
          display: 'flex',
          value: ({ answers }) => {
            const total = (answers as InheritanceReport)?.heirs?.data?.reduce(
              (sum, heir) => sum + valueToNumber(heir.inheritance),
              0,
            )

            return formatCurrency(String(total ?? '0'))
          },
        }),
        buildDescriptionField({
          id: 'heirs_space2',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.taxFreeInheritance,
          display: 'flex',
          condition: showTaxFreeInOverview,
          value: ({ answers }) => {
            const total = (answers as InheritanceReport)?.heirs?.data?.reduce(
              (sum, heir) => sum + valueToNumber(heir.taxFreeInheritance),
              0,
            )

            return formatCurrency(String(total ?? '0'))
          },
        }),
        buildDescriptionField({
          id: 'heirs_space3',
          space: 'gutter',
          condition: showTaxFreeInOverview,
        }),
        buildKeyValueField({
          label: m.taxableInheritance,
          display: 'flex',
          value: ({ answers }) => {
            const total = (answers as InheritanceReport)?.heirs?.data?.reduce(
              (sum, heir) => sum + valueToNumber(heir.taxableInheritance),
              0,
            )

            return formatCurrency(String(total ?? '0'))
          },
        }),
        buildDescriptionField({
          id: 'heirs_space4',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.inheritanceTax,
          display: 'flex',
          value: ({ answers }) => {
            const total = (answers as InheritanceReport)?.heirs?.data?.reduce(
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
        buildDescriptionField({
          id: 'heirs_space5',
          title: m.fileUploadOtherDocumentsPrePaid,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'otherDocs',
          component: 'OverviewOtherDocuments',
        }),
        buildCustomField({
          id: 'overviewPrint',
          doesNotRequireAnswer: true,
          component: 'PrintScreen',
        }),
      ],
    }),
  ],
})
