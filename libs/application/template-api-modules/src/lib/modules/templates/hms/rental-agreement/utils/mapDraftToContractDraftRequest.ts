import {
  ContractDraftRequest,
  PropertyUnit,
  OtherCostItem,
  PartyContact,
} from '@island.is/clients/hms-rental-agreement'
import {
  DraftAnswers,
  DraftPropertyUnit,
  CostField,
} from '@island.is/application/templates/hms/rental-agreement'

const mapDraftParty = (p: {
  email: string
  phone: string
  nationalIdWithName: { name: string; nationalId: string }
}): PartyContact => ({
  nationalIdWithName: {
    name: p.nationalIdWithName.name,
    nationalId: p.nationalIdWithName.nationalId,
  },
  phone: p.phone,
  email: p.email,
  address: null,
})

const mapDraftUnit = (u: DraftPropertyUnit): PropertyUnit => ({
  size: u.size ?? 0,
  address: u.address ?? null,
  sizeUnit: u.sizeUnit ?? null,
  unitCode: u.unitCode ?? null,
  addressCode: u.addressCode ?? 0,
  propertyCode: u.propertyCode ?? 0,
  propertyValue: u.propertyValue ?? 0,
  appraisalUnitCode: u.appraisalUnitCode ?? 0,
  fireInsuranceValuation: u.fireInsuranceValuation ?? 0,
  propertyUsageDescription: u.propertyUsageDescription ?? null,
  checked: u.checked,
  changedSize: u.changedSize,
  numOfRooms: u.numOfRooms,
})

const mapCostItem = (item: CostField): OtherCostItem => ({
  description: item.description ?? null,
  amount: item.amount != null ? String(item.amount) : null,
})

export const mapDraftToContractDraftRequest = (
  draft: DraftAnswers,
): ContractDraftRequest => {
  const {
    units,
    otherCostPayedByTenant,
    otherCostItems,
    securityDepositRequired,
    landlords,
    landlordRepresentatives,
    tenants,
    signingParties,
    ...rest
  } = draft
  return {
    ...rest,
    units: units.map(mapDraftUnit),
    otherCostPayedByTenant: [otherCostPayedByTenant],
    otherCostItems: otherCostItems.map(mapCostItem),
    securityDepositRequired: [securityDepositRequired],
    landlords: landlords.map(mapDraftParty),
    landlordRepresentatives: landlordRepresentatives.map(mapDraftParty),
    tenants: tenants.map(mapDraftParty),
    signingParties: signingParties.map(mapDraftParty),
  }
}
