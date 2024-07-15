import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue } from '@island.is/application/types'
import { BasicInformation } from '../lib/dataSchema'
import { machine } from '../lib/messages'

export const getBasicMachineInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const basicMachineInformation = getValueViaPath(
    answers,
    'machine.basicInformation',
  ) as BasicInformation

  return [
    `${formatMessage(machine.labels.basicMachineInformation.type)}: ${
      basicMachineInformation.type
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.model)}: ${
      basicMachineInformation.model
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.category)}: ${
      basicMachineInformation.category
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.subcategory)}: ${
      basicMachineInformation.subcategory
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.productionCountry,
    )}: ${basicMachineInformation.productionCountry}`,
    `${formatMessage(machine.labels.basicMachineInformation.productionYear)}: ${
      basicMachineInformation.productionYear
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.productionNumber,
    )}: ${basicMachineInformation.productionNumber}`,
    `${formatMessage(machine.labels.basicMachineInformation.markedCE)}: ${
      basicMachineInformation.markedCE
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.preRegistration,
    )}: ${basicMachineInformation.preRegistration}`,
    `${formatMessage(machine.labels.basicMachineInformation.isUsed)}: ${
      basicMachineInformation.isUsed
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.location)}: ${
      basicMachineInformation.location
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.cargoFileNumber,
    )}: ${basicMachineInformation.cargoFileNumber}`,
  ]
}
