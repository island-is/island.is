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
            buildAlertMessageField({
              id: 'reminderToFillInSpouse',
              title: '',
              message: m.heirsReminderToFillInSpouse,
              alertType: 'info',
              marginBottom: 'containerGutter',
              condition: (answers) => {
                return (
                  getValueViaPath<string>(
                    answers,
                    'customShare.deceasedWasMarried',
                  ) === YES
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
              title: '',
              placeholder: m.infoPlaceholder,
              variant: 'textarea',
              rows: 4,
              maxLength: 1800,
            }),
            buildDescriptionField({
              id: 'heirsAdditionalInfoFilesPrivateTitle',
              title: m.fileUploadPrivateTransfer,
              description: m.uploadPrivateTransferUserGuidelines,
              titleVariant: 'h5',
              space: 'containerGutter',
              marginBottom: 'smallGutter',
            }),
            buildFileUploadField({
              id: 'heirsAdditionalInfoPrivateTransferFiles',
              uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
              uploadDescription: m.uploadPrivateTransferDescription,
              title: '',
              uploadHeader: '',
              uploadMultiple: false,
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
              title: '',
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
              title: '',
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
              title: '',
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
              title: '',
              id: 'otherDocs',
              component: 'OverviewOtherDocuments',
            }),
            buildDescriptionField({
              id: 'heirs_space7',
              title: '',
              marginBottom: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'heirsConfirmation',
              title: '',
              large: false,
              backgroundColor: 'white',
              options: [{ value: YES, label: m.heirsOverviewConfirmation }],
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
