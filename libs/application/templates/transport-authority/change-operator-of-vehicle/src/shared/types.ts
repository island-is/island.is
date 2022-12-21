import { z } from 'zod'
import {
  OperatorInformationSchema,
  UserInformationSchema,
} from '../lib/dataSchema'

export type OperatorField = {
  nationalId: string
  name: string
  email: string
  phone: string
  approved?: boolean
}

export type UserInformation = z.TypeOf<typeof UserInformationSchema>
export type OperatorInformation = z.TypeOf<typeof OperatorInformationSchema>
