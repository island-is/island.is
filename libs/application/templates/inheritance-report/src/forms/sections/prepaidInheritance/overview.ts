import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'
import { InheritanceReport } from '../../../lib/dataSchema'
import { roundedValueToNumber, valueToNumber } from '../../../lib/utils/helpers'
import { calculateTotalAssets } from '../../../lib/utils/calculateTotalAssets'

export const prepaidOverview = buildSection({
  id: 'prepaidOverview',
  title: m.overview,
  children: [
    buildSubSection({
      id: 'heirsOverview',
      title: m.overviewHeirsTitle,
      children: [
        buildMultiField({
          id: 'heirsOverview',
          title: m.overviewHeirsTitle,
          description: m.overviewHeirsDescription,
          children: [
            buildDescriptionField({
              id: 'overviewAssetsTitle',
              title: m.properties,
              titleVariant: 'h3',
              space: 'gutter',
              marginBottom: 'gutter',
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.totalValueOfAssets,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(roundedValueToNumber(calculateTotalAssets(answers))),
                ),
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
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
            buildDescriptionField({
              id: 'heirs_space5',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.fileUploadOtherDocumentsPrePaid,
              value: ({ answers }) => {
                const files = getValueViaPath<any>(
                  answers,
                  'heirsAdditionalInfoFilesOtherDocuments',
                )
                return files.map((file: any) => file.name).join(', ')
              },
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
