import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  Contract,
  TerminationReason,
} from '@island.is/clients/hms-rental-agreement'
import * as m from '../lib/messages'

export const rentalContractOptions = (application: Application) => {
  const contracts = getValueViaPath<Array<Contract>>(
    application.externalData,
    'getRentalAgreements.data',
  )

  if (!contracts) {
    return []
  }

  return contracts.map((contract) => ({
    value: contract.contractId?.toString() ?? '',
    label: {
      ...(contract.contractTypeUseCode === 'INDEFINITEAGREEMENT'
        ? m.chooseContractMessages.optionUnboundTerm
        : m.chooseContractMessages.optionFixedTerm),
      values: {
        contractId: contract.contractId,
        address: contract?.contractProperty?.[0]?.streetAndHouseNumber ?? '',
        apartmentNumber: contract?.contractProperty?.[0]?.apartment
          ? ` - Íbúð: ${contract.contractProperty?.[0].apartment}`
          : '',
      },
    },
  }))
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
