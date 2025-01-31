import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  ExtraData,
  FormValue,
  Application as ApplicationType,
} from '@island.is/application/types'
import { Machine } from '../shared/types'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import { MachineAnswers } from '../lib/dataSchema'

export const getSelectedMachine = (
  externalData: ExternalData,
  answers: FormValue,
) => {
  if (getValueViaPath<boolean | undefined>(answers, 'machine.findVehicle')) {
    const machine = getValueViaPath(answers, 'machine') as Machine
    return machine
  }

  const machineId = getValueViaPath(answers, 'machine.id', '') as Machine
  const machinesWithTotal = getValueViaPath(
    externalData,
    'machinesList.data',
    {},
  ) as MachinesWithTotalCount

  return machinesWithTotal.machines.find((machine) => machine.id === machineId)
}

export const mustInspectBeforeStreetRegistration = (
  externalData: ExternalData,
  regNumber: string,
) => {
  const inspectBeforeTypes = getValueViaPath(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  ) as string[]

  return inspectBeforeTypes?.includes(regNumber.substring(0, 2)) || false
}

export const getExtraData = (application: ApplicationType): ExtraData[] => {
  const streetAnswers = application.answers as MachineAnswers
  return [
    { name: 'regNumber', value: streetAnswers.machine.regNumber || '' },
    { name: 'date', value: streetAnswers.machine?.date || '' },
  ]
}

export const isInvalidRegistrationType = (
  externalData: ExternalData,
  regNumber: string,
) => {
  const validTypes = getValueViaPath<string[]>(
    externalData,
    'availableRegistrationTypes.data',
    [],
  )
  const inspectBeforeTypes = getValueViaPath<string[]>(
    externalData,
    'typesMustInspectBeforeRegistration.data',
    [],
  )

  const regType = regNumber.substring(0, 2)

  return (
    !validTypes?.includes(regType) && !inspectBeforeTypes?.includes(regType)
  )
}

export const isMachineDisabled = (
  externalData: ExternalData,
  regNumber: string,
): boolean => {
  const validTypes = getValueViaPath<string[]>(
    externalData,
    'availableRegistrationTypes.data',
    [],
  )

  const regType = regNumber.substring(0, 2)

  // Checks the machine type against the available registration types
  return !validTypes?.includes(regType)
}
