import { Nam } from '@island.is/clients/health-directorate'

export interface Message {
  id: string
  defaultMessage: string
  description: string
}

export interface PermitProgram {
  name?: string
  programId?: string
  error?: boolean
  errorMsg?: Message | string
  professionId?: string
  mainProgram?: Nam
  foundationProgram?: Nam
}
