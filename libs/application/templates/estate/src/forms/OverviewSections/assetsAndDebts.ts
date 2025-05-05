import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { EstateAsset, EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import {
  formatBankInfo,
  formatCurrency,
} from '@island.is/application/ui-components'
import { infer as zinfer } from 'zod'
import { estateSchema } from '../../lib/dataSchema'
import { EstateTypes } from '../../lib/constants'
import { customCurrencyFormat, valueToNumber } from '../../lib/utils'
import { getSumFromAnswers } from '../../utils/getSumFromAnswers'
import { getMarketValueShare } from '../../utils/getMarketValueShare'
type EstateSchema = zinfer<typeof estateSchema>

export const overviewAssetsAndDebts = [
  buildDescriptionField({
    id: 'overviewEstateHeader',
    title: m.realEstate,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
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
            m.propertyShare.defaultMessage +
              ': ' +
              (asset.share ? asset.share + '%' : '0%'),
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'estateAssetsTotal',
    title: m.total,
    description: ({ answers }) => {
      const total = getMarketValueShare(answers)
      return total
    },
    condition: (answers) =>
      !!getSumFromAnswers<EstateAsset>(
        answers,
        'estate.assets',
        'marketValue',
        (asset) => !!asset?.enabled,
      ),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewInventoryHeader',
    title: m.inventoryTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewInventory',
    title: m.inventoryTextField,
    description: ({ answers }) => getValueViaPath(answers, 'inventory.info'),
    titleVariant: 'h4',
    space: 'gutter',
    condition: (answers) => getValueViaPath(answers, 'inventory.info') !== '',
  }),
  buildDescriptionField({
    id: 'overviewInventoryValue',
    title: m.inventoryValueTitle,
    description: ({ answers }) => {
      const value = getValueViaPath<string>(answers, 'inventory.value')
      return formatCurrency(value ?? '0')
    },
    condition: (answers) => getValueViaPath(answers, 'inventory.value') !== '',
    titleVariant: 'h4',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'inventoryNotFilledOut',
    description: m.notFilledOutItalic,
    marginTop: [3],
    marginBottom: [3],
    condition: (answers) => getValueViaPath(answers, 'inventory.value') === '',
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
    description: ({ answers }) =>
      getSumFromAnswers<EstateAsset>(
        answers,
        'estate.vehicles',
        'marketValue',
        (asset) => !!asset?.enabled,
      ),
    condition: (answers) =>
      !!getSumFromAnswers<EstateAsset>(
        answers,
        'estate.vehicles',
        'marketValue',
        (asset) => !!asset?.enabled,
      ),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewGuns',
    title: m.guns,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
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
    description: ({ answers }) =>
      getSumFromAnswers<EstateAsset>(
        answers,
        'estate.guns',
        'marketValue',
        (asset) => !!asset?.enabled,
      ),
    condition: (answers) =>
      !!getSumFromAnswers<EstateAsset>(
        answers,
        'estate.guns',
        'marketValue',
        (asset) => !!asset?.enabled,
      ),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewEstateBankInfoTitle',
    title: m.estateBankInfo,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
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
                (
                  valueToNumber(account.balance) +
                  valueToNumber(account.exchangeRateOrInterest)
                ).toString() ?? '0',
              )}`,
            ],
          }),
        ),
    },
  ),
  buildDescriptionField({
    id: 'bankAccountsTotal',
    title: m.total,
    description: ({ answers }) =>
      getSumFromAnswers<EstateSchema['bankAccounts']>(
        answers,
        'bankAccounts',
        'accountTotal',
      ),
    condition: (answers) =>
      !!getSumFromAnswers<EstateSchema['bankAccounts']>(
        answers,
        'bankAccounts',
        'accountTotal',
      ),
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
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
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
    description: ({ answers }) =>
      getSumFromAnswers<EstateSchema['claims']>(answers, 'claims', 'value'),
    condition: (answers) =>
      !!getSumFromAnswers<EstateSchema['claims']>(answers, 'claims', 'value'),
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
      id: 'stocksCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? false
          : true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).stocks ?? []).map((stock) => {
          return {
            title: stock.organization,
            description: [
              `${m.stocksNationalId.defaultMessage}: ${formatNationalId(
                stock.nationalId ?? '',
              )}`,
              `${m.stocksFaceValue.defaultMessage}: ${customCurrencyFormat(
                stock.faceValue ?? '0',
              )}`,
              `${m.stocksRateOfChange.defaultMessage}: ${
                stock.rateOfExchange?.replace('.', ',') ?? '0'
              }`,
              `${m.stocksValue.defaultMessage}: ${customCurrencyFormat(
                stock.value ?? '0',
              )}`,
            ],
          }
        }),
    },
  ),
  buildDescriptionField({
    id: 'stocksTotal',
    title: m.total,
    description: ({ answers }) =>
      getSumFromAnswers<EstateSchema['stocks']>(answers, 'stocks', 'value'),
    condition: (answers) =>
      !!getSumFromAnswers<EstateSchema['stocks']>(answers, 'stocks', 'value'),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewOtherAssetsHeader',
    title: m.otherAssetsTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
      id: 'otherAssetsCards',
      component: 'Cards',
      doesNotRequireAnswer: true,
    },
    {
      cards: ({ answers }: Application) =>
        ((answers as unknown as EstateSchema).otherAssets ?? []).map(
          (otherAsset) => {
            return {
              title: otherAsset.info,
              description: [
                `${m.otherAssetsValue.defaultMessage}: ${formatCurrency(
                  otherAsset.value ?? '0',
                )}`,
              ],
            }
          },
        ),
    },
  ),
  buildDescriptionField({
    id: 'otherAssetsTotal',
    title: m.total,
    description: ({ answers }) =>
      getSumFromAnswers<EstateSchema['otherAssets']>(
        answers,
        'otherAssets',
        'value',
      ),
    condition: (answers) =>
      !!getSumFromAnswers<EstateSchema['otherAssets']>(
        answers,
        'otherAssets',
        'value',
      ),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewMoneyAndDepositHeader',
    title: m.moneyAndDepositTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildDescriptionField({
    id: 'overviewMoneyAndDeposit',
    title: m.moneyAndDepositText,
    description: ({ answers }) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.info'),
    titleVariant: 'h4',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.info') !== '',
  }),
  buildDescriptionField({
    id: 'overviewMoneyAndDepositValue',
    title: m.moneyAndDepositValue,
    description: ({ answers }) => {
      const value =
        getValueViaPath<string>(answers, 'moneyAndDeposit.value') ?? '0'

      return formatCurrency(value)
    },
    titleVariant: 'h4',
    marginBottom: 'gutter',
    space: 'gutter',
    condition: (answers) =>
      getValueViaPath<string>(answers, 'moneyAndDeposit.value') !== '',
  }),
  buildDescriptionField({
    id: 'moneyAndDepositNotFilledOut',
    description: m.notFilledOutItalic,
    marginTop: [3],
    marginBottom: [3],
    condition: (answers) => {
      return getValueViaPath<string>(answers, 'moneyAndDeposit.value') === ''
    },
  }),
  buildDividerField({}),
  buildDescriptionField({
    id: 'overviewDebtsTitle',
    title: m.debtsTitle,
    titleVariant: 'h3',
    space: 'gutter',
  }),
  buildCustomField(
    {
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
    description: ({ answers }) =>
      getSumFromAnswers<EstateSchema['debts']>(answers, 'debts', 'balance'),
    condition: (answers) =>
      !!getSumFromAnswers<EstateSchema['debts']>(answers, 'debts', 'balance'),
    titleVariant: 'h4',
  }),
  buildDividerField({}),
]
