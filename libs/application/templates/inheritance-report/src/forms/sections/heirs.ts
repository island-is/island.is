import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildFileUploadField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { InheritanceReport } from '../../lib/dataSchema'
import { m } from '../../lib/messages'
import {
  roundedValueToNumber,
  shouldShowCustomSpouseShare,
  valueToNumber,
} from '../../lib/utils/helpers'
import { PREPAID_INHERITANCE } from '../../lib/constants'

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
            }),
            buildDescriptionField({
              id: 'debtsTotal',
            }),
            buildDescriptionField({
              id: 'shareTotal',
            }),
            buildDescriptionField({
              id: 'netTotal',
            }),
            buildDescriptionField({
              id: 'spouseTotal',
            }),
            buildDescriptionField({
              id: 'estateTotal',
            }),
            buildDescriptionField({
              id: 'netPropertyForExchange',
            }),
            buildCustomField({
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
          description: ({ answers }) =>
            answers.applicationFor === PREPAID_INHERITANCE
              ? m.heirsAndPartitionPrePaidDescription
              : m.heirsAndPartitionDescription,
          children: [
            buildDescriptionField({
              id: 'heirs.total',
            }),
            buildDescriptionField({
              id: 'heirs.hasModified',
            }),
            buildAlertMessageField({
              id: 'reminderToFillInSpouse',
              message: m.heirsReminderToFillInSpouse,
              alertType: 'info',
              marginBottom: 'containerGutter',
              condition: (answers) => {
                return (
                  getValueViaPath<string>(
                    answers,
                    'customShare.deceasedWasMarried',
                  ) === YES &&
                  getValueViaPath<string>(
                    answers,
                    'customShare.hasCustomSpouseSharePercentage',
                  ) === NO
                )
              },
            }),
            buildCustomField(
              {
                title: '',
                id: 'heirs.data',
                doesNotRequireAnswer: true,
                component: 'HeirsRepeater',
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
                    title: m.inheritanceAmount,
                    id: 'inheritance',
                    readOnly: true,
                    currency: true,
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
      id: 'privateTransfer',
      title: m.fileUploadPrivateTransfer,
      children: [
        buildMultiField({
          id: 'heirsAdditionalInfo',
          title: m.fileUploadPrivateTransfer,
          description: m.uploadPrivateTransferUserGuidelines,
          children: [
            buildFileUploadField({
              id: 'heirsAdditionalInfoPrivateTransferFiles',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.uploadPrivateTransferDescription,
              uploadHeader: '',
              uploadMultiple: false,
            }),
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
            buildDescriptionField({
              id: 'heirsAdditionalInfoFiles',
              title: m.info,
              titleVariant: 'h5',
              marginBottom: 'smallGutter',
            }),
            buildTextField({
              id: 'heirsAdditionalInfo',
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 4,
              maxLength: 1800,
            }),
            buildDescriptionField({
              id: 'heirsAdditionalInfoFilesOtherDocumentsTitle',
              title: m.fileUploadOtherDocuments,
              description: m.uploadOtherDocumentsUserGuidelines,
              titleVariant: 'h5',
              space: 'containerGutter',
              marginBottom: 'smallGutter',
            }),
            buildFileUploadField({
              id: 'heirsAdditionalInfoFilesOtherDocuments',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.uploadOtherDocumentsDescription,
              uploadHeader: '',
              uploadMultiple: true,
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
          title: m.overviewHeirsTitle,
          description: m.overviewHeirsDescription,
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
              label: m.totalDeduction,
              display: 'flex',
              condition: shouldShowCustomSpouseShare,
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
              condition: shouldShowCustomSpouseShare,
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
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.fileUploadPrivateTransfer,
              value: ({ answers }) => {
                const file = getValueViaPath<any>(
                  answers,
                  'heirsAdditionalInfoPrivateTransferFiles',
                )?.[0]
                return file?.name ?? ''
              },
            }),
            buildDescriptionField({
              id: 'heirs_space6',
              title: m.fileUploadOtherDocuments,
              titleVariant: 'h5',
              space: 'gutter',
            }),
            buildCustomField({
              id: 'otherDocs',
              component: 'OverviewOtherDocuments',
            }),
            buildDescriptionField({
              id: 'heirs_space7',
              marginBottom: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'heirsConfirmation',
              large: false,
              backgroundColor: 'white',
              options: [{ value: YES, label: m.heirsOverviewConfirmation }],
            }),
            buildCustomField({
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
