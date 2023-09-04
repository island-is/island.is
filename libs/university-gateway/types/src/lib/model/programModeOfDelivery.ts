import { ModeOfDelivery } from './program'

export type ProgramModeOfDelivery = {
  id: string
  programId: string
  modeOfDelivery: ModeOfDelivery
  created: Date
  modified: Date
}
