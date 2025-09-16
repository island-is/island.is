/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { estateSchema } from '@island.is/application/templates/estate'
import { infer as zinfer } from 'zod'
import { UploadData } from '../types'
import { filterEmptyObjects } from './filters'
import { info } from 'kennitala'

const toNumber = (s?: string): number => {
  if (!s) return 0
  const normalized = s
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '')
  const n = parseFloat(normalized)
  return Number.isNaN(n) ? 0 : n
}

type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']

const estateAssetMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: (element as EstateAsset)?.marketValue || '',
  }
}

const bankAccountMapper = (
  element: EstateAsset & { accruedInterest?: string },
) => {
  return {
    accountNumber: element.assetNumber || '',
    balance: element.marketValue || '',
    accruedInterest: element.exchangeRateOrInterest || '0',
    initial: true,
    enabled: true,
  }
}

const claimsMapper = (element: EstateAsset) => {
  return {
    publisher: element.description || '',
    value: element.marketValue || '',
    nationalId: element.assetNumber || '',
    initial: true,
    enabled: true,
  }
}

const stocksMapper = (
  element: EstateAsset & { upphaed?: string; gengiVextir?: string },
) => {
  const faceValueNum = toNumber(element.upphaed ?? element.marketValue)
  const rate = toNumber(element.gengiVextir) || 1
  const calculatedValue = (faceValueNum * rate).toString()

  return {
    organization: element.description || '',
    nationalId: element.assetNumber || '',
    faceValue: faceValueNum.toString(),
    rateOfExchange: rate.toString(),
    value: calculatedValue,
    initial: true,
    enabled: true,
  }
}

const inventoryMapper = (cashItems: EstateAsset[]) => {
  const descriptions = cashItems
    .map((item) => item.description)
    .filter((desc) => desc && desc.trim() !== '')
    .join(', ')

  const totalValue = cashItems.reduce(
    (sum, item) => sum + toNumber(item.marketValue),
    0,
  )

  return {
    info: descriptions,
    value: totalValue.toString(),
  }
}

const moneyAndDepositMapper = (elements: EstateAsset[]) => {
  if (!elements || elements.length === 0) {
    return { info: '', value: '' }
  }

  // Aggregate all money and deposit items
  const totalValue = elements.reduce(
    (sum, element) => sum + toNumber(element.marketValue),
    0,
  )

  const descriptions = elements
    .map((element) => element.description)
    .filter(Boolean)
    .join(', ')

  return {
    info: descriptions || '',
    value: totalValue.toString(),
  }
}

// Map camelCase debt types from API to PascalCase for dropdown
const mapDebtTypeForUI = (debtType: string): string => {
  const debtTypeMapping: Record<string, string> = {
    duties: 'Duties',
    otherDebts: 'OtherDebts',
    propertyFees: 'PropertyFees',
    insuranceCompany: 'InsuranceCompany',
    loan: 'Loan',
    creditCard: 'CreditCard',
    overdraft: 'Overdraft',
  }
  return debtTypeMapping[debtType] || 'OtherDebts'
}

const debtsMapper = (element: any) => {
  return {
    creditorName: element.description || '',
    nationalId: '', // Should be empty - only filled by user
    loanIdentity: element.assetNumber || '',
    balance: element.amount || element.marketValue || '',
    debtType: mapDebtTypeForUI(element.debtType || 'otherDebts'),
    initial: true,
    enabled: true,
  }
}

const otherAssetsMapper = (element: EstateAsset) => {
  return {
    description: element.description || '',
    value: element.marketValue || '0',
    initial: true,
    enabled: true,
  }
}

const estateMemberMapper = (element: EstateMember) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    phone: element.phone ?? '',
    email: element.email ?? '',
    relationWithApplicant: '',
    noContactInfo: ['No'] as ('Yes' | 'No')[],
    advocate: element.advocate
      ? {
          ...element.advocate,
          phone: '',
          email: '',
        }
      : info(element?.nationalId).age < 18
      ? { nationalId: '', name: '', phone: '', email: '' }
      : undefined,
    advocate2: element.advocate2
      ? {
          ...element.advocate2,
          phone: '',
          email: '',
        }
      : info(element?.nationalId).age < 18
      ? { nationalId: '', name: '', phone: '', email: '' }
      : undefined,
  }
}

export const trueOrHasYes = (element: string | boolean): string => {
  const elementString = element.toString().toLowerCase()
  const value = elementString === 'yes' || elementString === 'true'
  return value.toString()
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => estateAssetMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => estateAssetMapper<EstateAsset>(el))
  const ships = estate.ships.map((el) => estateAssetMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) =>
    estateAssetMapper<EstateAsset>(el),
  )
  const guns = estate.guns.map((el) => estateAssetMapper<EstateAsset>(el))
  const bankAccounts = estate.bankAccounts.map((el) => bankAccountMapper(el))
  const claims = estate.claims.map((el) => claimsMapper(el))
  const stocks = estate.stocks.map((el) => stocksMapper(el))
  const otherAssets = estate.otherAssets.map((el) => otherAssetsMapper(el))
  const otherDebts = estate.otherDebts?.map((el: any) => debtsMapper(el)) ?? []
  const inventory = inventoryMapper(estate.cash)
  const moneyAndDeposit = moneyAndDepositMapper(estate.moneyAndDeposit)
  const estateMembers = estate.estateMembers.map((el) => estateMemberMapper(el))

  return {
    ...estate,
    estateMembers,
    assets,
    flyers,
    ships,
    vehicles,
    guns,
    bankAccounts,
    claims,
    stocks,
    otherAssets,
    otherDebts,
    inventory,
    moneyAndDeposit,
  }
}

// -----------------------------------------------------------------
// ----------------------- EXPANDERS -------------------------------
// -----------------------------------------------------------------
// Optional properties do not appear as part of the data entry object
// When coming from the frontend.
// For processing on their end, the district commissioner requires that
// we maximally expand everything to include the same properties but with
// some sensible defaults on missing properties.
// Therefore we just expand these properties according to the upload data specifications.

export const expandAssetFrames = (
  assetFrames: UploadData['assets'],
): UploadData['assets'] => {
  const expandedAssetFrames: UploadData['assets'] = []

  assetFrames
    .filter(filterEmptyObjects)
    .filter((assetFrame: any) => assetFrame.enabled !== false)
    .forEach((assetFrame) => {
      expandedAssetFrames.push({
        assetNumber: assetFrame.assetNumber ?? '',
        description: assetFrame.description ?? '',
        enabled: assetFrame.enabled ?? true,
        marketValue: assetFrame.marketValue ?? '',
        share: assetFrame.share ?? '',
      })
    })

  return expandedAssetFrames
}

export const expandClaims = (
  claims: UploadData['claims'],
): UploadData['claims'] => {
  const expandedClaims: UploadData['claims'] = []

  claims
    .filter(filterEmptyObjects)
    .filter((claim: any) => claim.enabled !== false)
    .forEach((claim) => {
      expandedClaims.push({
        publisher: claim?.publisher ?? '',
        value: claim?.value ?? '',
        nationalId: claim?.nationalId ?? '',
      })
    })
  return expandedClaims
}

export const expandEstateMembers = (
  members: UploadData['estateMembers'],
): UploadData['estateMembers'] => {
  const expandedMembers: UploadData['estateMembers'] = []

  members
    .filter(filterEmptyObjects)
    .filter((member: any) => member.enabled !== false)
    .forEach((member) => {
      expandedMembers.push({
        ...member,
        dateOfBirth: member.dateOfBirth ?? '',
        enabled: member.enabled ?? true,
        email: member.email ?? '',
        // TODO: investigate better why nationalId and SSN is required
        nationalId: member.nationalId ?? '',
        ssn: member.ssn ?? '',
        phone: member.phone ?? '',
        relation: member.relation ?? '',
        relationWithApplicant: member.relationWithApplicant ?? '',
        advocate: {
          address: member.advocate?.address ?? '',
          email: member.advocate?.email ?? '',
          name: member.advocate?.name ?? '',
          nationalId: member.advocate?.nationalId ?? '',
          phone: member.advocate?.phone ?? '',
        },
      })
    })
  return expandedMembers
}

export const expandBankAccounts = (
  bankAccounts: UploadData['bankAccounts'],
): UploadData['bankAccounts'] => {
  const expandedBankAccounts: UploadData['bankAccounts'] = []

  bankAccounts
    .filter(filterEmptyObjects)
    .filter((bankAccount: any) => bankAccount.enabled !== false)
    .forEach((bankAccount) => {
      expandedBankAccounts.push({
        accountNumber: bankAccount.accountNumber ?? '',
        balance: bankAccount.balance ?? '',
        accruedInterest: bankAccount.accruedInterest ?? '0',
        accountTotal: bankAccount.accountTotal ?? '',
      })
    })

  return expandedBankAccounts
}

export const expandDebts = (
  debts: UploadData['debts'],
): UploadData['debts'] => {
  const expandedDebts: UploadData['debts'] = []

  debts
    .filter(filterEmptyObjects)
    .filter((debt: any) => debt.enabled !== false)
    .forEach((debt) => {
      expandedDebts.push({
        balance: debt.balance ?? '',
        creditorName: debt.creditorName ?? '',
        loanIdentity: debt.loanIdentity ?? '',
        nationalId: debt.nationalId ?? '',
        ssn: debt.ssn ?? '',
        debtType: debt.debtType ?? 'OtherDebts',
      })
    })

  return expandedDebts
}

export const expandStocks = (
  stocks: UploadData['stocks'],
): UploadData['stocks'] => {
  const expandedStocks: UploadData['stocks'] = []

  stocks
    .filter(filterEmptyObjects)
    .filter((stock: any) => stock.enabled !== false)
    .forEach((stock) => {
      expandedStocks.push({
        faceValue: stock.faceValue ?? '',
        nationalId: stock.nationalId ?? '',
        organization: stock.organization ?? '',
        rateOfExchange: stock.rateOfExchange ?? '',
        ssn: stock.ssn ?? '',
        value: stock.value ?? '',
      })
    })

  return expandedStocks
}

export const expandOtherAssets = (
  otherAssets: UploadData['otherAssets'],
): UploadData['otherAssets'] => {
  const expandedOtherAssets: UploadData['otherAssets'] = []

  otherAssets
    .filter(filterEmptyObjects)
    .filter((otherAsset: any) => otherAsset.enabled !== false)
    .forEach((otherAsset) => {
      expandedOtherAssets.push({
        info: otherAsset.info ?? (otherAsset as any).description ?? '',
        value: otherAsset.value ?? '',
      })
    })

  return expandedOtherAssets
}
