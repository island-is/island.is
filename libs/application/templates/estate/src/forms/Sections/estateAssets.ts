import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildCustomField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateTypes, YES } from '../../lib/constants'
import { getAssetDescriptionText } from '../../lib/utils'

export const estateAssets = buildSection({
  id: 'estateProperties',
  title: m.properties,
  condition: (answers) =>
    getValueViaPath(answers, 'selectedEstate') ===
    EstateTypes.estateWithoutAssets
      ? getValueViaPath(answers, 'estateWithoutAssets.estateAssetsExist') ===
        YES
      : true,
  children: [
    buildSubSection({
      id: 'realEstate',
      title: m.realEstate,
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'realEstateTitle',
              title: m.realEstate,
              description: m.realEstateDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField({
              id: 'estate.assets',
              component: 'RealEstateRepeater',
            }),
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
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'membersOfEstateTitle',
              title: m.inventoryTitle,
              description: m.inventoryDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField({
              id: 'estate.inventory',
              component: 'InventoryFields',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'vehicles',
      title: m.vehicles,
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'vehiclesTitle',
              title: m.vehicles,
              description: m.vehiclesDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField({
              id: 'estate.vehicles',
              component: 'VehicleRepeater',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'guns',
      title: m.guns,
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'gunsTitle',
              title: m.guns,
              description: m.gunsDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.guns',
                component: 'AssetsRepeater',
              },
              {
                assetName: 'guns',
                texts: {
                  assetTitle: m.gunTitle,
                  assetNumber: m.gunNumberLabel,
                  assetType: m.gunTypeLabel,
                  addAsset: m.addGun,
                },
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
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'estateBankInfoTitle',
              title: m.estateBankInfo,
              description: m.estateBankInfoDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.bankAccounts',
                component: 'BankAccountsRepeater',
              },
              {
                fields: [
                  {
                    title: m.bankAccount,
                    id: 'accountNumber',
                  },
                  {
                    title: m.bankAccountBalance,
                    id: 'balance',
                    currency: true,
                  },
                  {
                    title: m.bankAccountInterestRate,
                    id: 'accruedInterest',
                    required: true,
                    currency: true,
                  },
                  {
                    title: m.total,
                    id: 'accountTotal',
                    required: false,
                    readOnly: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.bankAccountRepeaterButton,
                repeaterHeaderText: m.bankAccount,
                sumField: 'accountTotal',
                currency: true,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'claims',
      title: m.claimsTitle,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? false
          : true,
      children: [
        buildMultiField({
          id: 'claims',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'claimsTitle',
              title: m.claimsTitle,
              description: m.claimsDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.claims',
                component: 'ClaimsRepeater',
              },
              {
                repeaterButtonText: m.claimsRepeaterButton,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'stocks',
      title: m.stocksTitle,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? false
          : true,
      children: [
        buildMultiField({
          id: 'stocks',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'stocksTitle',
              title: m.stocksTitle,
              description: m.stocksDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.stocks',
                component: 'StocksRepeater',
              },
              {
                repeaterButtonText: m.stocksRepeaterButton,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'moneyAndDeposit',
      title: m.moneyAndDepositTitle,
      children: [
        buildMultiField({
          id: 'moneyAndDeposit',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'moneyAndDepositTitle',
              title: m.moneyAndDepositTitle,
              description: m.moneyAndDepositDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.moneyAndDeposit',
                component: 'MoneyAndDepositFields',
              },
              {},
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'otherAssets',
      title: m.otherAssetsTitle,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? false
          : true,
      children: [
        buildMultiField({
          id: 'otherAssets',
          title: m.propertiesTitle,
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'otherAssetsTitle',
              title: m.otherAssetsTitle,
              description: m.otherAssetsDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildCustomField(
              {
                id: 'estate.otherAssets',
                component: 'OtherAssetsRepeater',
              },
              {
                repeaterButtonText: m.otherAssetRepeaterButton,
              },
            ),
          ],
        }),
      ],
    }),
  ],
})
