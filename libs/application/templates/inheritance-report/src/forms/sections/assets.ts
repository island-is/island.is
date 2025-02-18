import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  getEstateDataFromApplication,
  shouldShowDeceasedShareField,
} from '../../lib/utils/helpers'
import { Application, FormValue } from '@island.is/application/types'
import {
  ESTATE_INHERITANCE,
  PREPAID_INHERITANCE,
  PrePaidInheritanceOptions,
} from '../../lib/constants'

export const assets = buildSection({
  id: 'estateProperties',
  title: m.properties,
  children: [
    buildSubSection({
      id: 'realEstate',
      title: m.realEstate,
      condition: (answers) => {
        return answers.applicationFor === PREPAID_INHERITANCE
          ? !!getValueViaPath<string>(answers, 'prepaidInheritance')?.includes(
              PrePaidInheritanceOptions.REAL_ESTATE,
            )
          : true
      },
      children: [
        buildMultiField({
          id: 'realEstate',
          title: m.propertiesTitle,
          description: (application) =>
            application.answers.applicationFor === PREPAID_INHERITANCE
              ? m.propertiesDescriptionPrePaidAssets
              : m.propertiesDescriptionAssets,
          children: [
            buildDescriptionField({
              id: 'realEstateTitle',
              title: m.realEstate,
              description: (application) =>
                application.answers.applicationFor === PREPAID_INHERITANCE
                  ? m.realEstateDescriptionPrePaid
                  : m.realEstateDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.realEstate.total',
            }),
            buildDescriptionField({
              id: 'assets.realEstate.hasModified',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.realEstate.data',
                component: 'EstateAndVehiclesRepeater',
              },
              {
                fields: [
                  {
                    title: m.assetNumber,
                    id: 'assetNumber',
                    placeholder: 'F1234567',
                    required: true,
                  },
                  {
                    title: m.assetAddress,
                    id: 'description',
                    backgroundColor: 'white',
                    readOnly: true,
                    required: true,
                  },
                  {
                    title: m.propertyShare,
                    id: 'share',
                    type: 'number',
                    suffix: '%',
                    required: true,
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.propertyValuation,
                      [PREPAID_INHERITANCE]: m.propertyValuationPrePaid,
                    },
                    id: 'propertyValuation',
                    currency: true,
                    required: true,
                  },
                ],
                assetKey: 'assets',
                calcWithShareValue: false,
                repeaterButtonText: m.addRealEstate,
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
      condition: (answers) => {
        return answers.applicationFor !== PREPAID_INHERITANCE
      },
      children: [
        buildMultiField({
          id: 'inventory',
          title: m.propertiesTitle,
          description: m.propertiesDescriptionInventory,
          children: [
            buildDescriptionField({
              id: 'inventoryTitle',
              title: m.inventoryTitle,
              description: m.inventoryDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildTextField({
              id: 'assets.inventory.info',
              title: m.inventoryTextField,
              placeholder: m.inventoryTextField,
              variant: 'textarea',
              defaultValue: (application: Application) => {
                return (
                  getEstateDataFromApplication(application)
                    ?.inheritanceReportInfo?.cash?.[0]?.description ?? ''
                )
              },
              rows: 4,
              maxLength: 1800,
            }),
            buildTextField({
              id: 'assets.inventory.value',
              title: m.inventoryValueTitle,
              width: 'half',
              defaultValue: (application: Application) => {
                return (
                  getEstateDataFromApplication(application)
                    ?.inheritanceReportInfo?.cash?.[0]?.propertyValuation ?? '0'
                )
              },
              variant: 'currency',
            }),
            buildCustomField(
              {
                title: '',
                condition: shouldShowDeceasedShareField,
                id: 'assets.inventory',
                width: 'full',
                component: 'DeceasedShareField',
              },
              {
                id: 'assets.inventory',
                paddingTop: 2,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assets.vehicles',
      title: m.vehicles,
      condition: (answers) => {
        return answers.applicationFor !== PREPAID_INHERITANCE
      },
      children: [
        buildMultiField({
          id: 'vehicles',
          title: m.propertiesTitle,
          description: m.propertiesDescriptionVehicles,
          children: [
            buildDescriptionField({
              id: 'vehiclesTitle',
              title: m.vehicles,
              description: m.vehiclesDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.vehicles.total',
            }),
            buildDescriptionField({
              id: 'assets.vehicles.hasModified',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.vehicles.data',
                component: 'EstateAndVehiclesRepeater',
              },
              {
                fields: [
                  {
                    title: m.vehicleNumberLabel,
                    id: 'assetNumber',
                    placeholder: 'ABC12',
                    required: true,
                  },
                  {
                    title: m.vehicleType,
                    id: 'description',
                    backgroundColor: 'white',
                    readOnly: true,
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.vehicleValuation,
                      [PREPAID_INHERITANCE]: m.marketValue,
                    },
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                assetKey: 'vehicles',
                repeaterButtonText: m.addVehicle,
                fromExternalData: 'vehicles.data',
                sumField: 'propertyValuation',
                calcWithShareValue: false,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'assets.guns',
      title: m.guns,
      condition: (answers) => {
        return answers.applicationFor !== PREPAID_INHERITANCE
      },
      children: [
        buildMultiField({
          id: 'guns',
          title: m.propertiesTitle,
          description: m.propertiesDescriptionGuns,
          children: [
            buildDescriptionField({
              id: 'gunsTitle',
              title: m.guns,
              description: m.gunsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.guns.total',
            }),
            buildDescriptionField({
              id: 'modifiers.guns.hasModified',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.guns.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.gunSerialNumber,
                    id: 'assetNumber',
                    required: true,
                  },
                  {
                    title: m.gunType,
                    id: 'description',
                    required: true,
                  },
                  {
                    title: m.gunValuation,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                assetKey: 'guns',
                calcWithShareValue: false,
                repeaterButtonText: m.addGun,
                fromExternalData: 'guns',
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'estateBankInfo',
      title: m.estateBankInfo,
      condition: (answers) => {
        return answers.applicationFor !== PREPAID_INHERITANCE
      },
      children: [
        buildMultiField({
          id: 'estateBankInfo',
          title: m.propertiesTitle,
          description: m.propertiesDescriptionBankAccounts,
          children: [
            buildDescriptionField({
              id: 'estateBankInfoTitle',
              title: m.estateBankInfo,
              description: m.estateBankInfoDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.bankAccounts.total',
            }),
            buildDescriptionField({
              id: 'modifiers.bankAccounts.hasModified',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.bankAccounts.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.bankAccount,
                    id: 'assetNumber',
                    required: true,
                    format: '####-##-######',
                    placeholder: '0000-00-000000',
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.bankAccountCapital,
                      [PREPAID_INHERITANCE]: m.bankAccountCapitalPrePaid,
                    },
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                  {
                    title: m.bankAccountPenaltyInterestRates,
                    id: 'exchangeRateOrInterest',
                    required: true,
                    currency: true,
                    condition: (applicationFor: string) =>
                      applicationFor === ESTATE_INHERITANCE,
                  },
                  {
                    title: m.total,
                    id: 'bankAccountTotal',
                    required: false,
                    readOnly: true,
                    currency: true,
                    condition: (applicationFor: string) =>
                      applicationFor === ESTATE_INHERITANCE,
                  },
                  {
                    title: m.bankAccountForeign,
                    id: 'foreignBankAccount',
                  },
                ],
                assetKey: 'bankAccounts',
                calcWithShareValue: false,
                fromExternalData: 'bankAccounts',
                skipPushRight: true,
                repeaterButtonText: m.bankAccountRepeaterButton,
                sumField: 'propertyValuation',
                sumField2: 'exchangeRateOrInterest',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'claims',
      title: m.claimsTitle,
      condition: (answers) => {
        return answers.applicationFor !== PREPAID_INHERITANCE
      },
      children: [
        buildMultiField({
          id: 'claims',
          title: m.propertiesTitle,
          description: m.propertiesDescriptionClaims,
          children: [
            buildDescriptionField({
              id: 'claimsTitle',
              title: m.claimsTitle,
              description: m.claimsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.claims.total',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.claims.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.claimsIssuer,
                    id: 'description',
                  },
                  {
                    title: m.nationalId,
                    id: 'assetNumber',
                    type: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.claimsAmount,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                assetKey: 'claims',
                calcWithShareValue: false,
                fromExternalData: 'sharesAndClaims',
                repeaterButtonText: m.claimsRepeaterButton,
                sumField: 'propertyValuation',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'stocks',
      title: m.stocksTitle,
      condition: (answers) => {
        return answers.applicationFor === PREPAID_INHERITANCE
          ? !!getValueViaPath<string>(answers, 'prepaidInheritance')?.includes(
              PrePaidInheritanceOptions.STOCKS,
            )
          : true
      },
      children: [
        buildMultiField({
          id: 'stocks',
          title: m.propertiesTitle,
          description: (application) =>
            application.answers.applicationFor === PREPAID_INHERITANCE
              ? m.propertiesDescriptionPrePaidStocks
              : m.propertiesDescriptionStocks,
          children: [
            buildDescriptionField({
              id: 'stocksTitle',
              title: m.stocksTitle,
              description: (application) =>
                application.answers.applicationFor === PREPAID_INHERITANCE
                  ? m.stocksDescriptionPrePaid
                  : m.stocksDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.stocks.total',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.stocks.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.stocksOrganization,
                    id: 'description',
                    required: true,
                  },
                  {
                    title: m.stocksNationalId,
                    id: 'assetNumber',
                    type: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.stocksFaceValue,
                      [PREPAID_INHERITANCE]: m.stocksFaceValuePrePaid,
                    },
                    id: 'amount',
                    currency: true,
                    required: true,
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.stocksRateOfChange,
                      [PREPAID_INHERITANCE]: m.stocksRateOfChangePrePaid,
                    },
                    id: 'exchangeRateOrInterest',
                    type: 'currency',
                    required: true,
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.stocksValue,
                      [PREPAID_INHERITANCE]: m.marketValue,
                    },
                    id: 'value',
                    color: 'white',
                    readOnly: true,
                    currency: true,
                  },
                ],
                calcWithShareValue: false,
                assetKey: 'stocks',
                repeaterButtonText: m.stocksRepeaterButton,
                sumField: 'value',
                fromExternalData: 'stocks',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'money',
      title: (application) =>
        application.answers.applicationFor === PREPAID_INHERITANCE
          ? m.moneyTitlePrePaid
          : m.moneyTitle,
      condition: (answers) => {
        return answers.applicationFor === PREPAID_INHERITANCE
          ? !!getValueViaPath<string>(answers, 'prepaidInheritance')?.includes(
              PrePaidInheritanceOptions.MONEY,
            )
          : true
      },
      children: [
        buildMultiField({
          id: 'money',
          title: m.propertiesTitle,
          description: (application) =>
            application.answers.applicationFor === PREPAID_INHERITANCE
              ? m.propertiesDescriptionPrePaidMoney
              : m.propertiesDescriptionMoney,
          children: [
            buildDescriptionField({
              id: 'moneyTitle',
              title: (application) =>
                application.answers.applicationFor === PREPAID_INHERITANCE
                  ? m.moneyTitlePrePaid
                  : m.moneyTitle,
              description: (application) =>
                application.answers.applicationFor === PREPAID_INHERITANCE
                  ? m.moneyDescriptionPrePaid
                  : m.moneyDescription,
              titleVariant: 'h3',
              marginBottom: 2,
            }),
            buildTextField({
              id: 'assets.money.info',
              title: m.moneyText,
              placeholder: m.moneyPlaceholder,
              variant: 'textarea',
              defaultValue: (application: Application) => {
                return application.answers.applicationFor ===
                  PREPAID_INHERITANCE
                  ? ''
                  : getEstateDataFromApplication(application)
                      ?.inheritanceReportInfo?.depositsAndMoney?.[0]
                      ?.description ?? ''
              },
              rows: 4,
              maxLength: 1800,
              condition: (answers: FormValue) =>
                answers.applicationFor === ESTATE_INHERITANCE,
            }),
            buildTextField({
              id: 'assets.money.value',
              title: (application) =>
                application.answers?.applicationFor === PREPAID_INHERITANCE
                  ? m.moneyValuePrePaid
                  : m.moneyValue,
              width: 'half',
              variant: 'currency',
              defaultValue: (application: Application) => {
                return application.answers.applicationFor ===
                  PREPAID_INHERITANCE
                  ? '0'
                  : getEstateDataFromApplication(application)
                      ?.inheritanceReportInfo?.depositsAndMoney?.[0]
                      ?.propertyValuation ?? '0'
              },
            }),
            buildCustomField(
              {
                title: '',
                condition: shouldShowDeceasedShareField,
                id: 'assets.money',
                width: 'full',
                component: 'DeceasedShareField',
              },
              {
                id: 'assets.money',
                paddingTop: 2,
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'otherAssets',
      title: m.otherAssetsTitle,
      condition: (answers) => {
        return answers.applicationFor === PREPAID_INHERITANCE
          ? !!getValueViaPath<string>(answers, 'prepaidInheritance')?.includes(
              PrePaidInheritanceOptions.OTHER_ASSETS,
            )
          : true
      },
      children: [
        buildMultiField({
          id: 'otherAssets',
          title: m.propertiesTitle,
          description: (application) =>
            application.answers.applicationFor === PREPAID_INHERITANCE
              ? m.propertiesDescriptionPrePaidOtherAssets
              : m.propertiesDescriptionOtherAssets,
          children: [
            buildDescriptionField({
              id: 'otherAssetsTitle',
              title: m.otherAssetsTitle,
              description: (application) =>
                application.answers.applicationFor === PREPAID_INHERITANCE
                  ? m.otherAssetsDescriptionPrePaid
                  : m.otherAssetsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'assets.otherAssets.total',
            }),
            buildCustomField(
              {
                title: '',
                id: 'assets.otherAssets.data',
                component: 'OtherAssetsRepeater',
              },
              {
                fields: [
                  {
                    title: m.otherAssetsText,
                    id: 'info',
                    required: true,
                  },
                  {
                    title: {
                      [ESTATE_INHERITANCE]: m.otherAssetsValue,
                      [PREPAID_INHERITANCE]: m.marketValue,
                    },
                    id: 'value',
                    required: true,
                    currency: true,
                  },
                ],
                repeaterButtonText: m.otherAssetRepeaterButton,
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
            buildCustomField({
              id: 'overviewAssets',
              doesNotRequireAnswer: true,
              component: 'OverviewAssets',
            }),
            buildCustomField({
              id: 'assets.assetsTotal',
              component: 'SetTotalAssets',
            }),
            buildDescriptionField({
              id: 'space',
              marginBottom: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'assetsConfirmation',
              large: false,
              backgroundColor: 'white',
              options: ({ answers }) => [
                {
                  value: YES,
                  label:
                    answers.applicationFor === PREPAID_INHERITANCE
                      ? m.assetsOverviewConfirmationPrePaid
                      : m.assetsOverviewConfirmation,
                },
              ],
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
