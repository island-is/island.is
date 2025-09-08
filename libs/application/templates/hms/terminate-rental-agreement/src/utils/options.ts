import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import * as m from '../lib/messages'

export const rentalContractOptions = (application: Application) => {
  const contracts = getValueViaPath<Array<Contract>>(
    application.externalData,
    'getRentalAgreements.data',
  )

  if (!contracts) {
    return []
  }

  return contracts.map((contract) => {
    const renters = contract.contractParty
      ?.filter((party) => party.partyTypeUseCode === 'TENANT')
      .map((party) => party.name)
    const landlords = contract.contractParty
      ?.filter((party) => party.partyTypeUseCode === 'OWNER')
      .map((party) => party.name)
    return {
      value: contract.contractId?.toString() ?? '',
      label: {
        ...(contract.contractTypeUseCode === 'INDEFINETEAGREEMENT'
          ? m.chooseContractMessages.optionUnboundTerm
          : m.chooseContractMessages.optionFixedTerm),
        values: {
          contractId: contract.contractId,
          address: contract?.contractProperty?.[0]?.streetAndHouseNumber ?? '',
          apartmentNumber: contract?.contractProperty?.[0]?.apartment
            ? ` - Íbúð: ${contract.contractProperty?.[0].apartment}`
            : '',
          renters: renters?.join(', '),
          landlords: landlords?.join(', '),
        },
      },
    }
  })
}

// Copied from @island.is/clients/hms-rental-agreement
export enum TerminationReason {
  OWNERINBUILDING = 'OWNER_IN_BUILDING',
  FURNISHEDRENT = 'FURNISHED_RENT',
  OWNERTAKINGBACK = 'OWNER_TAKING_BACK',
  OWNERRELATIVES = 'OWNER_RELATIVES',
  OWNERSELLING = 'OWNER_SELLING',
  SIGNIFICANTREPAIRS = 'SIGNIFICANT_REPAIRS',
  TENANTEMPLOYEE = 'TENANT_EMPLOYEE',
  TENANTNONCOMPLIANCE = 'TENANT_NON_COMPLIANCE',
  TENANTBEHAVIOR = 'TENANT_BEHAVIOR',
  BOTHPARTIESINTERESTS = 'BOTH_PARTIES_INTERESTS',
  NONPROFITTENANT = 'NON_PROFIT_TENANT',
}

const terminationReasons = {
  [TerminationReason.OWNERINBUILDING]:
    m.unboundTerminationMessages.reasonOptionsCohabitation,
  [TerminationReason.FURNISHEDRENT]:
    m.unboundTerminationMessages.reasonOptionsFurnishedRent,
  [TerminationReason.OWNERTAKINGBACK]:
    m.unboundTerminationMessages.reasonOptionsTakingBack,
  [TerminationReason.OWNERRELATIVES]:
    m.unboundTerminationMessages.reasonOptionsRelatives,
  [TerminationReason.OWNERSELLING]:
    m.unboundTerminationMessages.reasonOptionsSelling,
  [TerminationReason.SIGNIFICANTREPAIRS]:
    m.unboundTerminationMessages.reasonOptionsSignificantRepairs,
  [TerminationReason.TENANTEMPLOYEE]:
    m.unboundTerminationMessages.reasonOptionsEmployee,
  [TerminationReason.TENANTNONCOMPLIANCE]:
    m.unboundTerminationMessages.reasonOptionsNonCompliance,
  [TerminationReason.TENANTBEHAVIOR]:
    m.unboundTerminationMessages.reasonOptionsBehavior,
  [TerminationReason.BOTHPARTIESINTERESTS]:
    m.unboundTerminationMessages.reasonOptionsBothPartiesInterests,
  [TerminationReason.NONPROFITTENANT]:
    m.unboundTerminationMessages.reasonOptionsNonProfitTenant,
}

export const terminationReasonOptions = Object.entries(terminationReasons).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
)
