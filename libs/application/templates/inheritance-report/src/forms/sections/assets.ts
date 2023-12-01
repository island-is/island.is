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
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'

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
              id: 'assets.realEstate.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.realEstate.data',
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
                    currency: true,
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
      id: 'assets.vehicles',
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
              id: 'assets.vehicles.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.vehicles.data',
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
                    currency: true,
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
      id: 'assets.guns',
      title: m.guns,
      children: [
        buildMultiField({
          id: 'guns',
          title: m.propertiesTitle,
          description:
            m.propertiesDescription.defaultMessage +
            ' ' +
            m.continueWithoutGuns.defaultMessage,
          children: [
            buildDescriptionField({
              id: 'gunsTitle',
              title: m.guns,
              description: m.gunsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.guns.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.guns.data',
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
                    title: m.gunType.defaultMessage,
                    id: 'description',
                  },
                  {
                    title: m.gunValuation.defaultMessage,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.addGun.defaultMessage,
                repeaterHeaderText: m.guns.defaultMessage,
                fromExternalData: 'guns',
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
              id: 'assets.inventory.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.inventory.data',
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
                    required: true,
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
              id: 'assets.bankAccounts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.bankAccounts.data',
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
                    required: true,
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
              id: 'assets.claims.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.claims.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.claimsIssuer.defaultMessage,
                    id: 'issuer',
                  },
                  {
                    title: m.claimsAmount.defaultMessage,
                    id: 'value',
                    required: true,
                    currency: true,
                  },
                  {
                    title: m.nationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
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
              id: 'assets.stocks.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.stocks.data',
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
              id: 'assets.money.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.money.data',
                component: 'ReportFieldsRepeater',
                doesNotRequireAnswer: true,
              },
              {
                fields: [
                  {
                    title: m.moneyTitle.defaultMessage,
                    id: 'moneyValue',
                    required: true,
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
              id: 'assets.otherAssets.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.otherAssets.data',
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
                    required: true,
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
      title: m.assetOverview,
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(
                  answers,
                  'assets.realEstate.total',
                )
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.vehicles.total')
                return formatCurrency(String(total))
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewGuns',
              title: m.guns,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.marketValue,
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.guns.total')
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.inventory.total')
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(
                  answers,
                  'assets.bankAccounts.total',
                )
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.claims.total')
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.stocks.total')
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(answers, 'assets.money.total')
                return formatCurrency(String(total))
              },
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
              display: 'flex',
              value: ({ answers }) => {
                const total = getValueViaPath(
                  answers,
                  'assets.otherAssets.total',
                )
                return formatCurrency(String(total))
              },
            }),
            buildDividerField({}),
            buildCustomField({
              title: '',
              id: 'assets.assetsTotal',
              doesNotRequireAnswer: true,
              component: 'CalculateTotalAssets',
            }),
          ],
        }),
      ],
    }),
  ],
})
