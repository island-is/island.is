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

type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']

const estateAssetMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: '',
  }
}

const estateMemberMapper = (element: EstateMember) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    phone: '',
    email: '',
    advocate: element.advocate
      ? {
          ...element.advocate,
          phone: '',
          email: '',
        }
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
  const estateMembers = estate.estateMembers.map((el) => estateMemberMapper(el))

  return {
    ...estate,
    estateMembers,
    assets,
    flyers,
    ships,
    vehicles,
    guns,
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

  assetFrames.filter(filterEmptyObjects).forEach((assetFrame) => {
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

  claims.filter(filterEmptyObjects).forEach((claim) => {
    expandedClaims.push({
      publisher: claim?.publisher ?? '',
      value: claim?.value ?? '',
    })
  })
  return expandedClaims
}

export const expandEstateMembers = (
  members: UploadData['estateMembers'],
): UploadData['estateMembers'] => {
  const expandedMembers: UploadData['estateMembers'] = []

  members.filter(filterEmptyObjects).forEach((member) => {
    const foreignCitizenship = Array.isArray(member.foreignCitizenship)
      ? member.foreignCitizenship[0]
      : member.foreignCitizenship
    expandedMembers.push({
      ...member,
      dateOfBirth: member.dateOfBirth ?? '',
      enabled: member.enabled ?? true,
      email: member.email ?? '',
      foreignCitizenship: trueOrHasYes(foreignCitizenship ?? 'false'),
      // TODO: investigate better why nationalId and SSN is required
      nationalId: member.nationalId ?? '',
      ssn: member.ssn ?? '',
      phone: member.phone ?? '',
      relation: member.relation ?? 'Óþekkt',
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

  bankAccounts.filter(filterEmptyObjects).forEach((bankAccount) => {
    expandedBankAccounts.push({
      accountNumber: bankAccount.accountNumber ?? '',
      balance: bankAccount.balance ?? '',
    })
  })

  return expandedBankAccounts
}

export const expandDebts = (
  debts: UploadData['debts'],
): UploadData['debts'] => {
  const expandedDebts: UploadData['debts'] = []

  debts.filter(filterEmptyObjects).forEach((debt) => {
    expandedDebts.push({
      balance: debt.balance ?? '',
      creditorName: debt.creditorName ?? '',
      loanIdentity: debt.loanIdentity ?? '',
      nationalId: debt.nationalId ?? '',
      ssn: debt.ssn ?? '',
    })
  })

  return expandedDebts
}

export const expandStocks = (
  stocks: UploadData['stocks'],
): UploadData['stocks'] => {
  const expandedStocks: UploadData['stocks'] = []

  stocks.filter(filterEmptyObjects).forEach((stock) => {
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
