import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
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
          id: 'overviewEstateAndLandsHeader',
          title: m.realEstateAndLand,
          description: m.realEstateAndLandDescription,
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
                  description: [asset.assetNumber],
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
            application.answers.inventory as string,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewInventoryValue',
          title: m.inventoryValueTitle,
          description: (application: Application) =>
            application.answers.inventoryValue as string,
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
                  description: [vehicle.assetNumber],
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
        buildKeyValueField({
          label: m.bankAccount,
          value: ({ answers }) =>
            (answers.bankAccounts as any)[0].accountNumber,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.bankAccountBalance,
          value: ({ answers }) => (answers.bankAccounts as any)[0].balance,
          width: 'half',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewClaimsInfoTitle',
          title: m.claimsTitle,
          description: m.claimsDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.claimsTitle,
          value: ({ answers }) => (answers.claims as any)[0].publisher,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.claimsAmount,
          value: ({ answers }) => (answers.claims as any)[0].value,
          width: 'half',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewStocksTitle',
          title: m.stocksTitle,
          description: m.stocksDescription,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.stocksOrganization,
          value: ({ answers }) => (answers.stocks as any)[0].organization,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.stocksSsn,
          value: ({ answers }) => (answers.stocks as any)[0].ssn,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.stocksFaceValue,
          value: ({ answers }) => (answers.stocks as any)[0].faceValue,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.stocksRateOfChange,
          value: ({ answers }) => (answers.stocks as any)[0].rateOfExchange,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.stocksValue,
          value: ({ answers }) => (answers.stocks as any)[0].value,
          width: 'half',
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
          title: m.moneyAndDepositText,
          description: (application: Application) =>
            application.answers.otherAssets as string,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMOtherAssetsValue',
          title: m.otherAssetsValue,
          description: (application: Application) =>
            application.answers.otherAssetsValue as string,
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
            application.answers.moneyAndDepositBoxesInfo as string,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewMoneyAndDepositValue',
          title: m.moneyAndDepositValue,
          description: (application: Application) =>
            application.answers.moneyAndDepositBoxesValue as string,
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
        buildKeyValueField({
          label: m.debtsCreditorName,
          value: ({ answers }) => (answers.debts as any)[0].creditorName,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.debtsSsn,
          value: ({ answers }) => (answers.debts as any)[0].ssn,
          width: 'half',
        }),
        buildKeyValueField({
          label: m.debtsBalance,
          value: ({ answers }) => (answers.debts as any)[0].balance,
          width: 'half',
        }),
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
