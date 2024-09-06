import { getValueViaPath } from '@island.is/application/core'
import { FormatMessage, FormValue, YES } from '@island.is/application/types'
import { AboutMachine, BasicInformation } from '../lib/dataSchema'
import { information, machine } from '../lib/messages'
import { NEW } from '../shared/types'

export const getBasicMachineInformation = (
  answers: FormValue,
  formatMessage: FormatMessage,
) => {
  const basicMachineInformation = getValueViaPath(
    answers,
    'machine.basicInformation',
  ) as BasicInformation
  const aboutMachineInformation = getValueViaPath(
    answers,
    'machine.aboutMachine',
  ) as AboutMachine

  return [
    `${formatMessage(machine.labels.basicMachineInformation.type)}: ${
      aboutMachineInformation.type
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.model)}: ${
      aboutMachineInformation.model
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.category)}: ${
      aboutMachineInformation.category
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.subcategory)}: ${
      aboutMachineInformation.subcategory
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
      basicMachineInformation.markedCE === YES
        ? formatMessage(information.labels.radioButtons.radioOptionYes)
        : formatMessage(information.labels.radioButtons.radioOptionNo)
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.preRegistration,
    )}: ${
      basicMachineInformation.preRegistration === YES
        ? formatMessage(information.labels.radioButtons.radioOptionYes)
        : formatMessage(information.labels.radioButtons.radioOptionNo)
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.isUsed)}: ${
      basicMachineInformation.isUsed === NEW
        ? formatMessage(machine.labels.basicMachineInformation.new)
        : formatMessage(machine.labels.basicMachineInformation.used)
    }`,
    `${formatMessage(machine.labels.basicMachineInformation.location)}: ${
      basicMachineInformation.location
    }`,
    `${formatMessage(
      machine.labels.basicMachineInformation.cargoFileNumber,
    )}: ${basicMachineInformation.cargoFileNumber}`,
  ]
}
