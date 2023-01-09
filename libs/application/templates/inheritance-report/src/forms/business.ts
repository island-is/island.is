import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../lib/messages'

export const business = buildSection({
  id: 'business',
  title: m.business,
  children: [
    buildSubSection({
      id: 'businessAssets',
      title: m.businessAssets,
      children: [
        buildMultiField({
          id: 'businessAssets',
          title: m.businessTitle,
          description: m.businessDescription,
          children: [
            buildDescriptionField({
              id: 'businessAssetsTitle',
              title: m.businessAssets,
              description: m.businessAssetsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'businessAssets.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'businessAssets.data',
                doesNotRequireAnswer: true,
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.businessAsset.defaultMessage,
                    id: 'businessAsset',
                  },
                  {
                    title: m.businessAssetAmount.defaultMessage,
                    id: 'businessAssetValue',
                    currency: true,
                    width: 'half',
                  },
                ],
                repeaterButtonText:
                  m.businessAssetRepeaterButton.defaultMessage,
                repeaterHeaderText:
                  m.businessAssetRepeaterHeader.defaultMessage,
                sumField: 'businessAssetValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'businessDebts',
      title: m.businessDebtsTitle,
      children: [
        buildMultiField({
          id: 'businessDebts',
          title: m.businessTitle,
          description: m.businessDescription,
          children: [
            buildDescriptionField({
              id: 'businessDebtsTitle',
              title: m.businessDebts,
              description: m.businessDebtsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'businessDebts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'businessDebts.data',
                doesNotRequireAnswer: true,
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName.defaultMessage,
                    id: 'businessDebt',
                  },
                  {
                    title: m.debtsSsn.defaultMessage,
                    id: 'ssn',
                    format: '######-####',
                  },
                  {
                    title: m.debtsBalance.defaultMessage,
                    id: 'debtValue',
                    currency: true,
                    width: 'half',
                  },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
                repeaterHeaderText: m.debtsCreditorHeader.defaultMessage,
                sumField: 'debtValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'businessOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'businessOverview',
          title: 'Yfirlit eigna og skulda í atvinnurekstri',
          description:
            'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBusinessAssets',
              title: 'Eignir í atvinnurekstri',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalAmount,
              value: ({ answers }) =>
                formatCurrency(String((answers.businessAssets as any).total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBusinessDebts',
              title: 'Skuldir í atvinnurekstri',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalAmount,
              value: ({ answers }) =>
                formatCurrency(String((answers.businessDebts as any).total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBusinessOwnedMoney',
              title: 'Eigið fé í atvinnurekstri',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalAmount,
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    (answers.businessAssets as any).total -
                      (answers.businessDebts as any).total,
                  ),
                ),
            }),
          ],
        }),
      ],
    }),
  ],
})
