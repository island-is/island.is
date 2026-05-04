import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { withAuthContext } from '@island.is/auth-nest-tools'
import {
  ContractDraftRequest,
  postContractSendDraft,
  postContract,
} from '@island.is/clients/hms-rental-agreement'
import {
  applicationAnswers,
  draftAnswers,
  DraftAnswers,
  DraftPropertyUnit,
  CostField,
} from '@island.is/application/templates/hms/rental-agreement'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { mapRentalApplicationData } from './utils/mapRentalApplicationData'
import {
  fetchFinancialIndexationForMonths,
  listOfLastMonths,
  FinancialIndexationEntry,
  errorMapper,
} from './utils/utils'
import { PropertyUnit, OtherCostItem, PartyContact } from '@island.is/clients/hms-rental-agreement'

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

const mapDraftToContractDraftRequest = (
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

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  async consumerIndex(): Promise<FinancialIndexationEntry[]> {
    const numberOfMonths = 36
    const months = listOfLastMonths(numberOfMonths)

    return await fetchFinancialIndexationForMonths(months)
  }

  async sendDraft({
    application,
    currentUserLocale,
    auth,
  }: TemplateApiModuleActionProps) {
    const { id, answers } = application

    const draftRequest = draftAnswers(
      applicationAnswers(answers),
      id,
      currentUserLocale,
    )

    return await withAuthContext(auth, () =>
      postContractSendDraft({
        body: mapDraftToContractDraftRequest(draftRequest),
      }),
    )
  }

  async submitApplicationToHmsRentalService({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application

    const mappedAnswers = applicationAnswers(answers)

    const leaseApplication = mapRentalApplicationData(
      id,
      applicant,
      mappedAnswers,
    )

    return await withAuthContext(auth, () =>
      postContract({ body: leaseApplication }),
    ).catch((error) => {
      const errorMessage = `Error sending application ${id} to HMS Rental Service`
      console.error(errorMessage, error)

      const mappedError = errorMapper(error)

      throw mappedError
    })
  }
}
