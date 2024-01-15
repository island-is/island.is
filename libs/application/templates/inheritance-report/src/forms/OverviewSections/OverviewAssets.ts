import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'

import { m } from '../../lib/messages'
import {
  ClaimsData,
  EstateAssets,
  OtherAssets,
  StocksData,
  otherassetsData,
} from '../../types'

export const overviewAssets = [
  buildDescriptionField({
    id: 'overviewRealEstate',
    title: m.realEstate,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const realEstateAssets = (answers.assets as unknown as EstateAssets)
          .realEstate.data
        return (
          realEstateAssets.map((asset: any) => ({
            title: asset.description,
            description: [
              `${m.assetNumber.defaultMessage}: ${asset.assetNumber}`,
              m.realEstateEstimation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.realEstateEstimation,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.realEstate.total')
      return formatCurrency(String(total))
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewVehicles',
    title: m.vehicles,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: (application: Application) => {
        const answers = application.answers
        const vehicleAssets = (answers.assets as unknown as EstateAssets)
          .vehicles.data
        return (
          vehicleAssets.map((asset: any) => ({
            title: asset.description,
            description: [
              `${m.vehicleNumberLabel.defaultMessage}: ${asset.assetNumber}`,
              m.vehicleValuation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
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
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const gunAssets = (answers.assets as unknown as EstateAssets).guns.data
        return (
          gunAssets.map((asset: any) => ({
            title: asset.description,
            description: [
              `${m.gunNumber.defaultMessage}: ${asset.assetNumber}`,
              m.gunValuation.defaultMessage +
                ': ' +
                (asset.propertyValuation
                  ? formatCurrency(asset.propertyValuation)
                  : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.guns.total')
      return total ? formatCurrency(String(total)): '0 kr.'
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
  buildDescriptionField({
    id: 'overviewInventory',
    title: m.inventoryTextField,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'assets.inventory.info'),
    titleVariant: 'h4',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'assets.inventory.info') !== '',
  }),
  buildKeyValueField({
    label: m.marketValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.inventory.value')
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
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const bankAccounts = (answers.assets as unknown as EstateAssets)
          .bankAccounts.data
        return (
          bankAccounts.map((asset: any) => ({
            title: asset.accountNumber,
            description: [
              asset.balance ? formatCurrency(asset.balance) : '0 kr.',
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.banksBalance,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.bankAccounts.total')
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
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const claims = (answers.assets as unknown as EstateAssets).claims.data
        return (
          claims.map((asset: ClaimsData) => ({
            title: asset.issuer,
            description: [
              m.claimsAmount.defaultMessage +
                ': ' +
                (asset.value ? formatCurrency(asset.value) : '0 kr.'),
            ],
          })) ?? []
        )
      },
    },
  ),
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
  buildCustomField(
    {
      title: '',
      id: 'estateAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) => {
        const stocks = (answers.assets as unknown as EstateAssets).stocks.data
        return (
          stocks.map((stock: StocksData) => ({
            title: stock.organization,
            description: [
              `${m.stocksNationalId.defaultMessage}: ${formatNationalId(
                stock.nationalId ?? '',
              )}`,
              `${m.stocksFaceValue.defaultMessage}: ${formatCurrency(
                stock.faceValue ?? '0',
              )}`,
              `${m.stocksRateOfChange.defaultMessage}: ${
                stock.rateOfExchange?.replace('.', ',') ?? '0'
              }`,
              `${m.stocksValue.defaultMessage}: ${formatCurrency(
                stock.value ?? '0',
              )}`,
            ],
          })) ?? []
        )
      },
    },
  ),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      console.log(answers)
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
  buildDescriptionField({
    id: 'moneyInfo',
    title: m.moneyText,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'assets.money.info'),
    titleVariant: 'h4',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'assets.money.info') !== '',
  }),
  buildKeyValueField({
    label: m.totalValue,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.money.value')
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
  buildDescriptionField({
    id: 'moneyInfo',
    title: m.otherAssetsDescription,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'assets.otherAssets.info'),
    titleVariant: 'h4',
    space: 'gutter',
    marginBottom: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'assets.otherAssets.info') !== '',
  }),

  buildKeyValueField({
    label: m.otherAssetsTotal,
    display: 'flex',
    value: ({ answers }) => {
      const total = getValueViaPath(answers, 'assets.otherAssets.value')
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
]
