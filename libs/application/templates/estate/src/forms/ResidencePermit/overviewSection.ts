import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { EstateAsset, EstateMember } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { format as formatNationalId } from 'kennitala'

export const overview = buildSection({
  id: 'overviewResidencePermit',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overviewResidencePermit',
      title: m.overviewTitle,
      description: m.overviewSubtitleResidencePermit,
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
              ((answers.estate as any).estateMembers ?? []).map(
                (member: EstateMember) => ({
                  title: member.name,
                  description: [
                    formatNationalId(member.nationalId),
                    member.relation,
                  ],
                }),
              ),
          },
        ),
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
              ((answers.estate as any).assets ?? []).map(
                (asset: EstateAsset) => ({
                  title: asset.description,
                  description: [
                    `${m.propertyNumber.defaultMessage}: ${asset.assetNumber}`,
                  ],
                }),
              ),
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
            getValueViaPath<string>(application.answers, 'inventory'),
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewInventoryValue',
          title: m.inventoryValueTitle,
          description: (application: Application) =>
            getValueViaPath<string>(application.answers, 'inventoryValue'),
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
              ((answers.estate as any)?.vehicles ?? []).map(
                (vehicle: EstateAsset) => ({
                  title: vehicle.description,
                  description: [
                    m.propertyNumber.defaultMessage +
                      ': ' +
                      vehicle.assetNumber,
                  ],
                }),
              ),
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
              ((answers.bankAccounts as any) ?? []).map((account: any) => ({
                title: account.accountNumber,
                description: [
                  `${m.bankAccountBalance.defaultMessage}: ${account.balance}`,
                ],
              })),
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
              ((answers.claims as any) ?? []).map((claim: any) => ({
                title: claim.publisher,
                description: [
                  `${m.claimsAmount.defaultMessage}: ${claim.value}`,
                ],
              })),
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
              ((answers.stocks as any) ?? []).map((stock: any) => ({
                title: stock.organization,
                description: [
                  `${m.stocksSsn.defaultMessage}: ${stock.ssn}`,
                  `${m.stocksFaceValue.defaultMessage}: ${stock.faceValue}`,
                  `${m.stocksRateOfChange.defaultMessage}: ${stock.rateOfExchange}`,
                  `${m.stocksValue.defaultMessage}: ${stock.value}`,
                ],
              })),
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
            getValueViaPath<string>(application.answers, 'otherAssets'),
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMOtherAssetsValue',
          title: m.otherAssetsValue,
          description: (application: Application) =>
            getValueViaPath<string>(application.answers, 'otherAssetsValue'),
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
              'moneyAndDepositBoxesInfo',
            ),
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMoneyAndDepositValue',
          title: m.moneyAndDepositValue,
          description: (application: Application) =>
            getValueViaPath<string>(
              application.answers,
              'moneyAndDepositBoxesValue',
            ),
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
              ((answers.debts as any) ?? []).map((debt: any) => ({
                title: debt.creditorName,
                description: [
                  `${m.debtsSsn.defaultMessage}: ${debt.ssn}`,
                  `${m.debtsBalance.defaultMessage}: ${debt.balance}`,
                ],
              })),
          },
        ),
        buildSubmitField({
          id: 'residencePermit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
