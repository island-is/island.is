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
      ...m.chooseContractMessages.option,
      values: {
        contractId: contract.contractId,
        contractType: contract.contractType?.toLowerCase() ?? '',
        address: contract?.contractProperty?.[0]?.streetAndHouseNumber ?? '',
        apartmentNumber: ` - Íbúð: ${
          contract?.contractProperty?.[0]?.apartment ?? ''
        }`,
      },
    },
  }))
}

export const terminationReasons = [
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

export const terminationReasonOptions = [
  {
    value: terminationReasons[0],
    label: terminationReasons[0],
  },
  {
    value: terminationReasons[1],
    label: terminationReasons[1],
  },
  {
    value: terminationReasons[2],
    label: terminationReasons[2],
  },
  {
    value: terminationReasons[3],
    label: terminationReasons[3],
  },
  {
    value: terminationReasons[4],
    label: terminationReasons[4],
  },
  {
    value: terminationReasons[5],
    label: terminationReasons[5],
  },
  {
    value: terminationReasons[6],
    label: terminationReasons[6],
  },
  {
    value: terminationReasons[7],
    label: terminationReasons[7],
  },
  {
    value: terminationReasons[8],
    label: terminationReasons[8],
  },
  {
    value: terminationReasons[9],
    label: terminationReasons[9],
  },
  {
    value: terminationReasons[10],
    label: terminationReasons[10],
  },
]
