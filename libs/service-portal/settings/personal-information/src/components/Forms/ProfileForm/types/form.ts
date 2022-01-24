import { FieldValues, UseFormMethods } from 'react-hook-form/dist/types/form'

export interface FormValues {
  email: string
  tel: string
  bankInfo: string
  nudge: boolean
  language: string
}

export type HookFormType = UseFormMethods<FieldValues & FormValues>
