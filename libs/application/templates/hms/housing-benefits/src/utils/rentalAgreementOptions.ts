import { Application } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import * as m from '../lib/messages'
import { getRentalAgreementsForHousingBenefits } from './rentalAgreementUtils'

export const rentalContractOptions = (application: Application) => {
  const contracts = getRentalAgreementsForHousingBenefits(application)

  return contracts.map((contract) => {
    const renters =
      contract.contractParty
        ?.filter((party) => party.partyTypeUseCode === 'TENANT')
        .map((party) => party.name) ?? []
    const landlords =
      contract.contractParty
        ?.filter((party) => party.partyTypeUseCode === 'OWNER')
        .map((party) => party.name) ?? []
    return {
      value: contract.contractId?.toString() ?? '',
      label: {
        ...(contract.contractTypeUseCode === 'INDEFINETEAGREEMENT'
          ? m.draftMessages.rentalAgreement.optionUnboundTerm
          : m.draftMessages.rentalAgreement.optionFixedTerm),
        values: {
          contractId: contract.contractId,
          address: contract?.contractProperty?.[0]?.streetAndHouseNumber ?? '',
          apartmentNumber: contract?.contractProperty?.[0]?.apartment
            ? ` - Íbúð: ${contract.contractProperty?.[0].apartment}`
            : '',
          landlords: landlords.join(', '),
          renters: renters.join(', '),
          landlordsCount: landlords.length,
          rentersCount: renters.length,
        },
      },
    }
  })
}
