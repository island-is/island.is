import { buildSection } from '@island.is/application/core'
import { machine } from '../../../lib/messages'
import { MachineType } from './MachineType'
import { MachineBasicInformation } from './MachineBasicInformation'
import { MachineTechnicalInformation } from './MachineTechnicalInformation'
import { MachineLicensePlate } from './MachineLicensePlate'

export const MachineSection = buildSection({
  id: 'machineSection',
  title: machine.general.sectionTitle,
  children: [
    MachineType,
    MachineBasicInformation,
    MachineTechnicalInformation,
    MachineLicensePlate,
  ],
})
