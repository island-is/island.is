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

const terminationReasons = [
  'Leigusali býr í sama húsnæði',
  'Húsnæði er leigt út með húsgögnum',
  'Leigusali tekur húsnæðið til eigin nota',
  'Leigusali ráðstafar húsnæði til skyldmenna',
  'Leigusali hyggst selja húsnæðið á næstu 6 mánuðum',
  'Fyrirhugaðar eru verulegar viðgerðir á húsnæði',
  'Leigjandi var starfsmaður leigusala og hefur látið af störfum',
  'Leigjandi hefur gerst sekur um vanefndir eða brot sem varða riftun',
  'Leigjandi hefur á annan hátt vanefnt skyldur sínar',
  'Sanngjarnt mat á hagsmunum og aðstæðum réttlætir uppsögn',
  'Leigusali er lögaðili sem er ekki rekinn í hagnaðarskyni og leigjandi uppfyllir ekki lengur skilyrði fyrir leigu',
]

export const terminationReasonOptions = terminationReasons.map(
  (terminationReason) => ({
    value: terminationReason,
    label: terminationReason,
  }),
)
