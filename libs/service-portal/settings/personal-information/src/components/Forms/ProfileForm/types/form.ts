import { FieldValues, UseFormMethods } from 'react-hook-form/dist/types/form'

export interface FormValues {
  email?: string
  tel?: string
  bankInfo?: string
  nudge?: boolean
  canNudge?: boolean // TODO CLEAN UP
}

export type HookFormType = UseFormMethods<FieldValues & FormValues>
