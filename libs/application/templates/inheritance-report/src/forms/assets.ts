import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../lib/messages'
import { Application } from '@island.is/api/schema'

export const assets = buildSection({
  id: 'estateProperties',
  title: m.properties,
  children: [
    buildSubSection({
      id: 'realEstate',
      title: m.realEstate,
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutAssests.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'realEstateTitle',
              title: m.realEstate,
              description: m.realEstateDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'realEstate.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'realEstate.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.assetNumber.defaultMessage,
                    id: 'assetNumber',
                  },
                  {
                    title: m.assetAddress.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.propertyValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                  },
                ],
                repeaterButtonText: m.addRealEstate.defaultMessage,
                repeaterHeaderText: m.realEstateRepeaterHeader.defaultMessage,
                fromExternalData: 'assets',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'vehicles',
      title: m.vehicles,
      children: [
        buildMultiField({
          id: 'vehicles',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutVehicles.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'vehiclesTitle',
              title: m.vehicles,
              description: m.vehiclesDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'vehicles.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'vehicles.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.assetNumber.defaultMessage,
                    id: 'assetNumber',
                  },
                  {
                    title: m.vehicleType.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.vehicleValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                  },
                ],
                repeaterButtonText: m.addVehicle.defaultMessage,
                repeaterHeaderText: m.vehicles.defaultMessage,
                fromExternalData: 'vehicles',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'inventory',
      title: m.inventoryTitle,
      children: [
        buildMultiField({
          id: 'inventory',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutInnventory.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'inventoryTitle',
              title: m.inventoryTitle,
              description: m.inventoryDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'inventory.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'inventory.data',
                doesNotRequireAnswer: true,
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.inventoryTextField.defaultMessage,
                    id: 'inventory',
                    placeholder: m.inventoryTextFieldPlaceholder.defaultMessage,
                    variant: 'textarea',
                    rows: 7,
                    width: 'full',
                  },
                  {
                    title: m.inventoryValueTitle.defaultMessage,
                    id: 'inventoryValue',
                    currency: true,
                    width: 'half',
                  },
                ],
                repeaterButtonText: m.addInventory.defaultMessage,
                repeaterHeaderText: m.inventoryTitle.defaultMessage,
                sumField: 'inventoryValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'estateBankInfo',
      title: m.estateBankInfo,
      children: [
        buildMultiField({
          id: 'estateBankInfo',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutBankAccounts.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'estateBankInfoTitle',
              title: m.estateBankInfo,
              description: m.estateBankInfoDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'bankAccounts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'bankAccounts.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.bankAccount.defaultMessage,
                    id: 'accountNumber',
                    format: '#### - ## - ######',
                  },
                  {
                    title: m.bankAccountBalance.defaultMessage,
                    id: 'balance',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.bankAccountRepeaterButton.defaultMessage,
                repeaterHeaderText: m.bankAccount.defaultMessage,
                sumField: 'balance',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'claims',
      title: m.claimsTitle,
      children: [
        buildMultiField({
          id: 'claims',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutClaims.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'claimsTitle',
              title: m.claimsTitle,
              description: m.claimsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'claims.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'claims.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.claimsPublisher.defaultMessage,
                    id: 'publisher',
                  },
                  {
                    title: m.claimsAmount.defaultMessage,
                    id: 'value',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.claimsRepeaterButton.defaultMessage,
                repeaterHeaderText: m.claimsTitle.defaultMessage,
                sumField: 'value',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'stocks',
      title: m.stocksTitle,
      children: [
        buildMultiField({
          id: 'stocks',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutStocks.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'stocksTitle',
              title: m.stocksTitle,
              description: m.stocksDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'stocks.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'stocks.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.stocksOrganization.defaultMessage,
                    id: 'organization',
                  },
                  {
                    title: m.stocksNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.stocksFaceValue.defaultMessage,
                    id: 'faceValue',
                    type: 'number',
                  },
                  {
                    title: m.stocksRateOfChange.defaultMessage,
                    id: 'rateOfExchange',
                    type: 'number',
                  },
                  {
                    title: m.stocksValue.defaultMessage,
                    id: 'value',
                    color: 'white',
                    readOnly: true,
                  },
                ],
                repeaterButtonText: m.stocksRepeaterButton.defaultMessage,
                repeaterHeaderText: m.stocksTitle.defaultMessage,
                sumField: 'value',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'money',
      title: m.moneyTitle,
      children: [
        buildMultiField({
          id: 'money',
          title: m.propertiesTitle,
          description: m.propertiesDescription,
          children: [
            buildDescriptionField({
              id: 'moneyTitle',
              title: m.moneyTitle,
              description: m.moneyDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'money.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'money.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.moneyTitle.defaultMessage,
                    id: 'moneyValue',
                    currency: true,
                    width: 'full',
                  },
                ],
                repeaterButtonText: m.addMoney.defaultMessage,
                repeaterHeaderText: m.moneyTitle.defaultMessage,
                sumField: 'moneyValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'otherAssets',
      title: m.otherAssetsTitle,
      children: [
        buildMultiField({
          id: 'otherAssets',
          title: m.propertiesTitle,
          description: m.propertiesDescription,
          children: [
            buildDescriptionField({
              id: 'otherAssetsTitle',
              title: m.otherAssetsTitle,
              description: m.otherAssetsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'otherAssets.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'otherAssets.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.otherAssetsText.defaultMessage,
                    id: 'otherAssets',
                    placeholder: m.otherAssetsPlaceholder.defaultMessage,
                    variant: 'textarea',
                    rows: 7,
                    width: 'full',
                  },
                  {
                    title: m.otherAssetsValue.defaultMessage,
                    id: 'otherAssetsValue',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addAsset.defaultMessage,
                repeaterHeaderText: m.assetHeaderText.defaultMessage,
                sumField: 'otherAssetsValue',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assetOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'assetOverview',
          title: m.assetOverview,
          description: m.assetOverviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewRealEstate',
              title: m.realEstate,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.realEstateEstimation,
              value: ({ answers }) =>
                formatCurrency(String((answers.realEstate as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewVehicles',
              title: m.vehicles,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.marketValue,
              value: ({ answers }) =>
                formatCurrency(String((answers.vehicles as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewInventory',
              title: m.inventoryTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.marketValue,
              value: ({ answers }) =>
                formatCurrency(String((answers.inventory as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBanks',
              title: m.estateBankInfo,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.banksBalance,
              value: ({ answers }) =>
                formatCurrency(String((answers.bankAccounts as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewClaims',
              title: m.claimsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalValue,
              value: ({ answers }) =>
                formatCurrency(String((answers.claims as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewStocks',
              title: m.stocksTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalValue,
              value: ({ answers }) =>
                formatCurrency(String((answers.stocks as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewMoney',
              title: m.moneyTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalValue,
              value: ({ answers }) =>
                formatCurrency(String((answers.money as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewOtherAssets',
              title: m.otherAssetsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.otherAssetsTotal,
              value: ({ answers }) =>
                formatCurrency(String((answers.otherAssets as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewAllAssetsWorth',
              title: m.totalValueOfAssets,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildTextField({
              id: 'assetsTotal',
              title: m.total,
              readOnly: true,
              width: 'half',
              variant: 'currency',
              rightAlign: true,
              backgroundColor: 'white',
              defaultValue: ({ answers }: Application) => {
                const total =
                  (answers.otherAssets as any)?.total +
                  (answers.money as any)?.total +
                  (answers.stocks as any)?.total +
                  (answers.claims as any)?.total +
                  (answers.bankAccounts as any)?.total +
                  (answers.inventory as any)?.total +
                  (answers.realEstate as any)?.total +
                  (answers.vehicles as any)?.total

                return total
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
