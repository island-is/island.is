import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import * as m from '../lib/messages'
import { terminationReasons } from '../shared'

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
