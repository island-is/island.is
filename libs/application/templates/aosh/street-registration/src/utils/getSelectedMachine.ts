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
  const machineId = getValueViaPath(answers, 'pickMachine.id', '') as Machine
  const machines = getValueViaPath(
    externalData,
    'machinesList.data',
    {},
  ) as MachinesWithTotalCount
  return machines.machines.find((machine) => machine.id === machineId)
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
  console.log('inspectBeforeTypes', inspectBeforeTypes)
  return inspectBeforeTypes?.includes(regNumber.substring(0, 2)) || false
}

export const getExtraData = (application: ApplicationType): ExtraData[] => {
  const streetAnswers = application.answers as MachineAnswers
  return [
    { name: 'regNumber', value: streetAnswers.machine.regNumber || '' },
    { name: 'date', value: streetAnswers.machine?.date || '' },
  ]
}
