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
  'Leigusali býr í sama húsnæði':
    m.unboundTerminationMessages.reasonOptionsCohabitation,
  'Húsnæði er leigt út með húsgögnum':
    m.unboundTerminationMessages.reasonOptionsFurnishedRent,
  'Leigusali tekur húsnæðið til eigin nota':
    m.unboundTerminationMessages.reasonOptionsTakingBack,
  'Leigusali ráðstafar húsnæði til skyldmenna':
    m.unboundTerminationMessages.reasonOptionsRelatives,
  'Leigusali hyggst selja húsnæðið á næstu 6 mánuðum':
    m.unboundTerminationMessages.reasonOptionsSelling,
  'Fyrirhugaðar eru verulegar viðgerðir á húsnæði':
    m.unboundTerminationMessages.reasonOptionsSignificantRepairs,
  'Leigjandi var starfsmaður leigusala og hefur látið af störfum':
    m.unboundTerminationMessages.reasonOptionsEmployee,
  'Leigjandi hefur gerst sekur um vanefndir eða brot sem varða riftun':
    m.unboundTerminationMessages.reasonOptionsNonCompliance,
  'Leigjandi hefur á annan hátt vanefnt skyldur sínar':
    m.unboundTerminationMessages.reasonOptionsBehavior,
  'Sanngjarnt mat á hagsmunum og aðstæðum réttlætir uppsögn':
    m.unboundTerminationMessages.reasonOptionsBothPartiesInterests,
  'Leigusali er lögaðili sem er ekki rekinn í hagnaðarskyni og leigjandi uppfyllir ekki lengur skilyrði fyrir leigu':
    m.unboundTerminationMessages.reasonOptionsNonProfitTenant,
}

export const terminationReasonOptions = Object.entries(terminationReasons).map(
  ([key, value]) => ({
    value: key,
    label: value,
  }),
)
