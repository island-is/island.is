import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
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
              title: '',
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
            buildTextField({
              id: 'inventory.info',
              title: m.inventoryTextField,
              placeholder: m.inventoryTextFieldPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'inventory.value',
              title: m.inventoryValueTitle,
              width: 'half',
              variant: 'currency',
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
            buildCustomField(
              {
                title: '',
                id: 'estate.vehicles',
                component: 'AssetsRepeater',
              },
              {
                assetName: 'vehicles',
                texts: {
                  assetTitle: m.vehiclesTitle,
                  assetNumber: m.vehicleNumberLabel,
                  assetType: m.vehicleTypeLabel,
                  addAsset: m.addVehicle,
                },
              },
            ),
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
                title: '',
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
                title: '',
                id: 'bankAccounts',
                component: 'TextFieldsRepeater',
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
                ],
                repeaterButtonText: m.bankAccountRepeaterButton,
                repeaterHeaderText: m.bankAccount,
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
                title: '',
                id: 'claims',
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.claimsPublisher,
                    id: 'publisher',
                  },
                  {
                    title: m.claimsAmount,
                    id: 'value',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.claimsRepeaterButton,
                repeaterHeaderText: m.claimsTitle,
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
                title: '',
                id: 'stocks',
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.stocksOrganization,
                    id: 'organization',
                  },
                  {
                    title: m.stocksNationalId,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.stocksFaceValue,
                    id: 'faceValue',
                    currency: true,
                  },
                  {
                    title: m.stocksRateOfChange,
                    id: 'rateOfExchange',
                    type: 'number',
                  },
                  {
                    title: m.stocksValue,
                    id: 'value',
                    backgroundColor: 'white',
                    currency: true,
                    readOnly: true,
                  },
                ],
                repeaterButtonText: m.stocksRepeaterButton,
                repeaterHeaderText: m.stocksTitle,
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
            buildTextField({
              id: 'moneyAndDeposit.info',
              title: m.moneyAndDepositText,
              placeholder: m.moneyAndDepositPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'moneyAndDeposit.value',
              title: m.moneyAndDepositValue,
              width: 'half',
              variant: 'currency',
            }),
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
          description: (application) => getAssetDescriptionText(application),
          children: [
            buildDescriptionField({
              id: 'otherAssetsTitle',
              title: m.otherAssetsTitle,
              description: m.otherAssetsDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildTextField({
              id: 'otherAssets.info',
              title: m.otherAssetsText,
              placeholder: m.otherAssetsPlaceholder,
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'otherAssets.value',
              title: m.otherAssetsValue,
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
  ],
})
