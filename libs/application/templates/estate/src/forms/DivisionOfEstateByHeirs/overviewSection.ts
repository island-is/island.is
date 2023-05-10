import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { format as formatNationalId } from 'kennitala'
import {
  formatBankInfo,
  formatCurrency,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { infer as zinfer } from 'zod'
import { estateSchema } from '../../lib/dataSchema'
type EstateSchema = zinfer<typeof estateSchema>

export const overview = buildSection({
  id: 'overviewDivisionOfEstateByHeirs',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overviewDivisionOfEstateByHeirs',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstateByHeirs,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewDeceasedHeader',
          title: m.theDeceased,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'space0',
          title: '',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewEstateMembersHeader',
          title: m.estateMembers,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'estateMembersCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ answers }: Application) =>
              (
                ((answers.estate as unknown) as EstateInfo).estateMembers.filter(
                  (member) => member.enabled,
                ) ?? []
              ).map((member) => ({
                title: member.name,
                description: [
                  member.nationalId !== ''
                    ? formatNationalId(member.nationalId)
                    : member.dateOfBirth,
                  member.relation,
                  formatPhoneNumber(member.phone || ''),
                  member.email,
                ],
              })),
          },
        ),
        buildKeyValueField({
          label: m.doesWillExist,
          value: ({ answers }) =>
            getValueViaPath(answers, 'estate.testament.wills'),
          width: 'half',
        }),
        buildKeyValueField({
          label: m.doesAgreementExist,
          value: ({ answers }) =>
            getValueViaPath(answers, 'estate.testament.agreement'),
          width: 'half',
        }),
        buildDescriptionField({
          id: 'space0',
          title: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.additionalInfo,
          value: ({ answers }) =>
            getValueViaPath(answers, 'estate.testament.additionalInfo'),
          width: 'half',
        }),
        buildDescriptionField({
          id: 'space1',
          title: '',
          space: 'gutter',
        }),
        buildDividerField({}),
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
                ((answers.estate as unknown) as EstateInfo).assets.filter(
                  (asset) => asset.enabled,
                ) ?? []
              ).map((asset) => ({
                title: asset.description,
                description: [
                  `${m.propertyNumber.defaultMessage}: ${asset.assetNumber}`,
                  m.overviewMarketValue.defaultMessage +
                    ': ' +
                    (asset.marketValue
                      ? formatCurrency(asset.marketValue)
                      : '0 kr.'),
                ],
              })),
          },
        ),
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
        }),
        buildDescriptionField({
          id: 'overviewInventoryValue',
          title: m.inventoryValueTitle,
          description: (application: Application) => {
            const value =
              getValueViaPath<string>(application.answers, 'inventory.value') ??
              ''
            return formatCurrency(value)
          },
          titleVariant: 'h4',
          marginBottom: 'gutter',
          space: 'gutter',
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
                ((answers.estate as unknown) as EstateInfo)?.vehicles?.filter(
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
                ((answers.estate as unknown) as EstateInfo)?.guns?.filter(
                  (guns) => guns.enabled,
                ) ?? []
              ).map((gun) => ({
                title: gun.description,
                description: [
                  m.propertyNumber.defaultMessage + ': ' + gun.assetNumber,
                  m.overviewMarketValue.defaultMessage +
                    ': ' +
                    (gun.marketValue
                      ? formatCurrency(gun.marketValue)
                      : '0 kr.'),
                ],
              })),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewEstateBankInfoTitle',
          title: m.estateBankInfo,
          description: m.estateBankInfoDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
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
              (((answers as unknown) as EstateSchema).bankAccounts ?? []).map(
                (account) => ({
                  title: formatBankInfo(account.accountNumber ?? ''),
                  description: [
                    `${m.bankAccountBalance.defaultMessage}: ${formatCurrency(
                      account.balance ?? '',
                    )}`,
                  ],
                }),
              ),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewClaimsInfoTitle',
          title: m.claimsTitle,
          description: m.claimsDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'claimsCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ answers }: Application) =>
              (((answers as unknown) as EstateSchema).claims ?? []).map(
                (claim) => ({
                  title: claim.publisher,
                  description: [
                    `${m.claimsAmount.defaultMessage}: ${formatCurrency(
                      claim.value ?? '',
                    )}`,
                  ],
                }),
              ),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewStocksTitle',
          title: m.stocksTitle,
          description: m.stocksDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
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
              (((answers as unknown) as EstateSchema).stocks ?? []).map(
                (stock) => ({
                  title: stock.organization,
                  description: [
                    `${m.stocksNationalId.defaultMessage}: ${formatNationalId(
                      stock.nationalId ?? '',
                    )}`,
                    `${m.stocksFaceValue.defaultMessage}: ${stock.faceValue}`,
                    `${m.stocksRateOfChange.defaultMessage}: ${stock.rateOfExchange}`,
                    `${m.stocksValue.defaultMessage}: ${formatCurrency(
                      stock.value ?? '',
                    )}`,
                  ],
                }),
              ),
          },
        ),
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
          title: m.moneyAndDepositText,
          description: (application: Application) =>
            getValueViaPath<string>(application.answers, 'otherAssets.info'),
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMOtherAssetsValue',
          title: m.otherAssetsValue,
          description: (application: Application) => {
            const value =
              getValueViaPath<string>(
                application.answers,
                'otherAssets.value',
              ) ?? ''
            return formatCurrency(value)
          },
          titleVariant: 'h4',
          marginBottom: 'gutter',
          space: 'gutter',
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
            getValueViaPath<string>(
              application.answers,
              'moneyAndDeposit.info',
            ),
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMoneyAndDepositValue',
          title: m.moneyAndDepositValue,
          description: (application: Application) => {
            const value =
              getValueViaPath<string>(
                application.answers,
                'moneyAndDeposit.value',
              ) ?? ''

            return formatCurrency(value)
          },
          titleVariant: 'h4',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'space2',
          title: '',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewDebtsTitle',
          title: m.debtsTitle,
          description: m.debtsDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
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
              (((answers as unknown) as EstateSchema).debts ?? []).map(
                (debt) => ({
                  title: debt.creditorName,
                  description: [
                    `${m.debtsNationalId.defaultMessage}: ${formatNationalId(
                      debt.nationalId ?? '',
                    )}`,
                    `${m.debtsBalance.defaultMessage}: ${formatCurrency(
                      debt.balance ?? '',
                    )}`,
                  ],
                }),
              ),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'space3',
          title: '',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewRepresentativeTitle',
          title: m.representativeTitle,
          description: m.representativeDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
        }),
        buildKeyValueField({
          width: 'half',
          label: m.nationalId,
          value: ({ answers }) =>
            formatNationalId(
              getValueViaPath<string>(answers, 'representative.nationalId') ??
                '',
            ),
        }),
        buildKeyValueField({
          width: 'half',
          label: m.name,
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'representative.name'),
        }),
        buildDescriptionField({
          id: 'space4',
          title: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          width: 'half',
          label: m.phone,
          value: ({ answers }) =>
            formatPhoneNumber(
              getValueViaPath<string>(answers, 'representative.phone') ?? '',
            ),
        }),
        buildKeyValueField({
          width: 'half',
          label: m.email,
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'representative.email'),
        }),
      ],
    }),
  ],
})
