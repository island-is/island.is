import { buildSection } from '@island.is/application/core'
import { machine } from '../../../lib/messages'
import { MachineType } from './MachineType'

export const MachineSection = buildSection({
  id: 'machineSection',
  title: machine.general.sectionTitle,
  children: [MachineType],
})
