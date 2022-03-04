import { FieldValues, UseFormMethods } from 'react-hook-form/dist/types/form'

export interface FormValues {
  email?: string
  tel?: string
  bankInfo?: string
  canNudge?: boolean
}

export interface BankInfoTypes {
  bank: string
  l: string
  account: string
}

export type DropModalType = 'tel' | 'mail' | 'all' | undefined
export type DataLoadingType = 'EMAIL' | 'TEL' | 'BANKINFO' | 'NUDGE' | undefined

export type HookFormType = UseFormMethods<FieldValues & FormValues>

export enum DataStatus {
  NOT_DEFINED = 'NOT_DEFINED',
  NOT_VERIFIED = 'NOT_VERIFIED',
  VERIFIED = 'VERIFIED',
  EMPTY = 'EMPTY',
}
