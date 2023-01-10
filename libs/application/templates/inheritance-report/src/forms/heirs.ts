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
      id: 'propertyForExchange',
      title: m.propertyForExchangeAndHeirs,
      children: [
        buildMultiField({
          id: 'propertyForExchange',
          title: m.propertyForExchange,
          description: m.propertyForExchangeDescription,
          children: [
            buildKeyValueField({
              label: m.netProperty,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    (answers.otherAssets as any)?.total +
                      (answers.money as any)?.total +
                      (answers.stocks as any)?.total +
                      (answers.claims as any)?.total +
                      (answers.bankAccounts as any)?.total +
                      (answers.inventory as any)?.total +
                      1200000 +
                      1200000 -
                      (Number(answers.funeralCostAmount) +
                        (answers.domesticAndForeignDebts as any)?.total +
                        (answers.publicCharges as any)?.total) +
                      ((answers.businessAssets as any)?.total -
                        (answers.businessDebts as any)?.total),
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
              value: '',
            }),
            buildTextField({
              id: 'totalDeduction',
              title: '',
              width: 'half',
              variant: 'currency',
              defaultValue: '0',
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
                    (answers.otherAssets as any)?.total +
                      (answers.money as any)?.total +
                      (answers.stocks as any)?.total +
                      (answers.claims as any)?.total +
                      (answers.bankAccounts as any)?.total +
                      (answers.inventory as any)?.total +
                      1200000 +
                      1200000 -
                      (Number(answers.funeralCostAmount) +
                        (answers.domesticAndForeignDebts as any)?.total +
                        (answers.publicCharges as any)?.total) +
                      ((answers.businessAssets as any)?.total -
                        (answers.businessDebts as any)?.total) -
                      Number(answers.totalDeduction ?? '0'),
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
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.heirsNationalId.defaultMessage,
                    id: 'ssn',
                    format: '######-####',
                  },
                  {
                    title: m.heirsName.defaultMessage,
                    id: 'creditorName',
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
                    id: 'percentage',
                  },
                  {
                    title: m.taxFreeInheritance.defaultMessage,
                    id: 'taxFreeInheritance',
                    readOnly: true,
                  },
                  {
                    title: m.inheritanceAmount.defaultMessage,
                    id: 'amount',
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
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsAddintionalInfo',
      title: '',
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
