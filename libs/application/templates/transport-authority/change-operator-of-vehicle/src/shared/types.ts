import { z } from 'zod'
import { OperatorInformationSchema } from '../lib/dataSchema'

export type OperatorField = {
  nationalId: string
  name: string
  email: string
  phone: string
  approved?: boolean
}

export type OperatorInformation = z.TypeOf<typeof OperatorInformationSchema>
