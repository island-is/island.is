import React, { ClipboardEvent, HTMLAttributes } from 'react'

import * as styles from './Input.css'
import { Icon as IconType, Type } from '../IconRC/iconMap'
import { ResponsiveProp } from '../../utils/responsiveProp'

export type InputBackgroundColor = 'white' | 'blue'

export interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export interface InputComponentProps {
  name: string
  value?: string | number
  defaultValue?: string | number
  id?: string
  className?: string
  disabled?: boolean
  required?: boolean
  rightAlign?: boolean
  readOnly?: boolean
  placeholder?: string
  autoFocus?: boolean
  maxLength?: number
  max?: number | string
  min?: number | string
  step?: string
  size?: keyof typeof styles.inputSize
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onClick?: (
    event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement, MouseEvent>,
  ) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  rows?: number
  type?: 'text' | 'number' | 'email' | 'tel' | 'password'

  /**
   * While true hover state will not show and focus state will be always on
   */
  fixedFocusState?: boolean
  autoComplete?:
    | 'on'
    | 'off'
    // A one-time password (OTP) for verifying user identity that is used as an additional factor in a sign-in flow.
    // Most commonly this is a code received via some out-of-channel mechanism, such as SMS, email, or authenticator application.
    | 'one-time-code'
  autoExpand?: {
    on: boolean
    maxHeight?: number
  }
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
}

export type InputButton = {
  name: IconType
  type?: Type
  label: string
  onClick?: React.HTMLAttributes<HTMLButtonElement>['onClick']
  disabled?: boolean
}

export type InputIcon = {
  name: IconType
  type?: Type
}

export interface InputProps extends InputComponentProps {
  label?: string
  hasError?: boolean
  errorMessage?: string
  tooltip?: string
  backgroundColor?: ResponsiveProp<InputBackgroundColor>
  textarea?: boolean
  maxLength?: number
  loading?: boolean
  icon?: InputIcon
  buttons?: InputButton[]
  max?: number | string
  min?: number | string
  step?: string
  hideIcon?: boolean
  oneDigit?: boolean
  onPaste?(event: ClipboardEvent<HTMLInputElement>): void
}

export interface AsideProps {
  icon: InputProps['icon']
  buttons: InputProps['buttons']
  size: InputProps['size']
  loading: boolean
  hasError: boolean
  hasLabel: boolean
}
