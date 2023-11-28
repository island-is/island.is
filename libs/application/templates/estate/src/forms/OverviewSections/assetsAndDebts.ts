import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { infer as zinfer } from 'zod'
import { estateSchema } from '../../lib/dataSchema'
import { EstateTypes } from '../../lib/constants'
type EstateSchema = zinfer<typeof estateSchema>

export const overviewAssetsAndDebts = [
  buildDescriptionField({
    id: 'overviewEstateHeader',
    title: m.realEstate,
    description: m.realEstateDescription,
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
      cards: ({ answers }: Application) =>
        (
          (answers.estate as unknown as EstateInfo).assets?.filter(
            (asset) => asset.enabled,
          ) ?? []
        ).map((asset) => ({
          title: asset.description,
          description: [
            `${m.propertyNumber.defaultMessage}: ${asset.assetNumber}`,
            m.overviewMarketValue.defaultMessage +
              ': ' +
              (asset.marketValue ? formatCurrency(asset.marketValue) : '0 kr.'),
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'estateAssetsTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers.estate as unknown as EstateInfo).assets
        ?.filter((asset) => asset.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const sum = (answers.estate as unknown as EstateInfo).assets
        ?.filter((asset) => asset.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewInventoryHeader',
    title: m.inventoryTitle,
    description: m.inventoryDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewInventory',
    title: m.inventoryTextField,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'inventory.info'),
    titleVariant: 'h4',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'inventory.info') !== '',
  }),
  buildDescriptionField({
    id: 'overviewInventoryValue',
    title: m.inventoryValueTitle,
    description: (application: Application) => {
      const value =
        getValueViaPath<string>(application.answers, 'inventory.value') ?? '0'
      return formatCurrency(value)
    },
    condition: (answers) =>
      getValueViaPath<string>(answers, 'inventory.value') !== '',
    titleVariant: 'h4',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildCustomField({
    id: 'inventoryNotFilledOut',
    title: '',
    component: 'NotFilledOut',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'inventory.value') === '',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewVehicles',
    title: m.vehicles,
    description: m.vehiclesDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateVehicleCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        (
          (answers.estate as unknown as EstateInfo)?.vehicles?.filter(
            (vehicle) => vehicle.enabled,
          ) ?? []
        ).map((vehicle) => ({
          title: vehicle.description,
          description: [
            m.propertyNumber.defaultMessage + ': ' + vehicle.assetNumber,
            m.overviewMarketValue.defaultMessage +
              ': ' +
              (vehicle.marketValue
                ? formatCurrency(vehicle.marketValue)
                : '0 kr.'),
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'estateVehicleTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers.estate as unknown as EstateInfo).vehicles
        ?.filter((vehicle) => vehicle.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const sum = (answers.estate as unknown as EstateInfo).vehicles
        ?.filter((vehicle) => vehicle.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewGuns',
    title: m.guns,
    description: m.gunsDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'estateGunsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        (
          (answers.estate as unknown as EstateInfo)?.guns?.filter(
            (guns) => guns.enabled,
          ) ?? []
        ).map((gun) => ({
          title: gun.description,
          description: [
            m.propertyNumber.defaultMessage + ': ' + gun.assetNumber,
            m.overviewMarketValue.defaultMessage +
              ': ' +
              (gun.marketValue ? formatCurrency(gun.marketValue) : '0 kr.'),
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'estateGunsTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers.estate as unknown as EstateInfo).guns
        ?.filter((gun) => gun.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const sum = (answers.estate as unknown as EstateInfo).guns
        ?.filter((gun) => gun.enabled)
        .reduce((acc, cur) => {
          const marketValue = Number(cur.marketValue) ?? 0

          if (marketValue) {
            return acc + marketValue
          }

          return acc
        }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewEstateBankInfoTitle',
    title: m.estateBankInfo,
    description: m.estateBankInfoDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'bankAccountsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).bankAccounts ?? []).map(
          (account) => ({
            title: formatBankInfo(account.accountNumber ?? ''),
            description: [
              `${m.bankAccountBalance.defaultMessage}: ${formatCurrency(
                account.balance ?? '0',
              )}`,
            ],
          }),
        ),
    },
  ),
  buildDescriptionField({
    id: 'bankAccountsTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers as unknown as EstateSchema).bankAccounts?.reduce(
        (acc, cur) => {
          const balance = Number(cur.balance) ?? 0

          if (balance) {
            return acc + balance
          }

          return acc
        },
        0,
      )

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const bankAccounts = answers?.bankAccounts
        ? (answers as unknown as EstateSchema).bankAccounts
        : null

      if (!bankAccounts) return false

      const sum = bankAccounts.reduce((acc, cur) => {
        const balance = Number(cur.balance) ?? 0

        if (balance) {
          return acc + balance
        }

        return acc
      }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets
        ? false
        : true,
  }),
  buildDescriptionField({
    id: 'overviewClaimsInfoTitle',
    title: m.claimsTitle,
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets
        ? false
        : true,
    description: m.claimsDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'claimsCards',
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? false
          : true,
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).claims ?? []).map((claim) => ({
          title: claim.publisher,
          description: [
            `${m.claimsAmount.defaultMessage}: ${formatCurrency(
              claim.value ?? '0',
            )}`,
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'claimsTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers as unknown as EstateSchema).claims?.reduce(
        (acc, cur) => {
          const value = Number(cur.value) ?? 0

          if (value) {
            return acc + value
          }

          return acc
        },
        0,
      )

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const claims = answers?.claims
        ? (answers as unknown as EstateSchema).claims
        : null

      if (!claims) return false

      const sum = claims.reduce((acc, cur) => {
        const value = Number(cur.value) ?? 0

        if (value) {
          return acc + value
        }

        return acc
      }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets
        ? false
        : true,
  }),
  buildDescriptionField({
    id: 'overviewStocksTitle',
    title: m.stocksTitle,
    description: m.stocksDescription,
    condition: (answers) =>
      getValueViaPath(answers, 'selectedEstate') ===
      EstateTypes.estateWithoutAssets
        ? false
        : true,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'stocksCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).stocks ?? []).map((stock) => ({
          title: stock.organization,
          description: [
            `${m.stocksNationalId.defaultMessage}: ${formatNationalId(
              stock.nationalId ?? '',
            )}`,
            `${m.stocksFaceValue.defaultMessage}: ${formatCurrency(
              stock.faceValue ?? 0,
            )}`,
            `${m.stocksRateOfChange.defaultMessage}: ${stock.rateOfExchange}`,
            `${m.stocksValue.defaultMessage}: ${formatCurrency(
              stock.value ?? '0',
            )}`,
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'stocksTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers as unknown as EstateSchema).stocks?.reduce(
        (acc, cur) => {
          const value = Number(cur.value) ?? 0

          if (value) {
            return acc + value
          }

          return acc
        },
        0,
      )

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const stocks = answers?.stocks
        ? (answers as unknown as EstateSchema).stocks
        : null

      if (!stocks) return false

      const sum = stocks.reduce((acc, cur) => {
        const value = Number(cur.value) ?? 0

        if (value) {
          return acc + value
        }

        return acc
      }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewOtherAssetsHeader',
    title: m.otherAssetsTitle,
    description: m.otherAssetsDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewOtherAssets',
    title: m.otherAssetsText,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'otherAssets.info'),
    titleVariant: 'h4',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'otherAssets.info') !== '',
  }),
  buildDescriptionField({
    id: 'overviewOtherAssetsValue',
    title: m.otherAssetsValue,
    description: (application: Application) => {
      const value =
        getValueViaPath<string>(application.answers, 'otherAssets.value') ?? '0'
      return formatCurrency(value === '' ? '0' : value)
    },
    titleVariant: 'h4',
    marginBottom: 'gutter',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'otherAssets.value') !== '',
  }),
  buildCustomField({
    id: 'otherAssetsNotFilledOut',
    title: '',
    component: 'NotFilledOut',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'otherAssets.value') === '',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewMoneyAndDepositHeader',
    title: m.moneyAndDepositTitle,
    description: m.moneyAndDepositDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewMoneyAndDeposit',
    title: m.moneyAndDepositText,
    description: (application: Application) =>
      getValueViaPath<string>(application.answers, 'moneyAndDeposit.info'),
    titleVariant: 'h4',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.info') !== '',
  }),
  buildDescriptionField({
    id: 'overviewMoneyAndDepositValue',
    title: m.moneyAndDepositValue,
    description: (application: Application) => {
      const value =
        getValueViaPath<string>(application.answers, 'moneyAndDeposit.value') ??
        '0'

      return formatCurrency(value)
    },
    titleVariant: 'h4',
    marginBottom: 'gutter',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.value') !== '',
  }),
  buildCustomField({
    id: 'moneyAndDepositNotFilledOut',
    title: '',
    component: 'NotFilledOut',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.value') === '',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewDebtsTitle',
    title: m.debtsTitle,
    description: m.debtsDescription,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      title: '',
      id: 'debtsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).debts ?? []).map((debt) => ({
          title: debt.creditorName,
          description: [
            `${m.debtsNationalId.defaultMessage}: ${formatNationalId(
              debt.nationalId ?? '',
            )}`,
            `${m.debtsLoanIdentity.defaultMessage}: ${debt.loanIdentity ?? ''}`,
            `${m.debtsBalance.defaultMessage}: ${formatCurrency(
              debt.balance ?? '0',
            )}`,
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'debtsTotal',
    title: m.total,
    description: ({ answers }: Application) => {
      const sum = (answers as unknown as EstateSchema).debts?.reduce(
        (acc, cur) => {
          const balance = Number(cur.balance) ?? 0

          if (balance) {
            return acc + balance
          }

          return acc
        },
        0,
      )

      if (sum && sum > 0) {
        return formatCurrency(String(sum))
      }

      return null
    },
    condition: (answers) => {
      const debts = answers?.debts
        ? (answers as unknown as EstateSchema).debts
        : null

      if (!debts) return false

      const sum = debts.reduce((acc, cur) => {
        const balance = Number(cur.balance) ?? 0

        if (balance) {
          return acc + balance
        }

        return acc
      }, 0)

      return sum > 0
    },
    titleVariant: 'h4',
  }),
  buildDividerField({}),
]
