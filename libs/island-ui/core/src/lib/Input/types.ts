import React from 'react'

import * as styles from './Input.treat'
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
  readOnly?: boolean
  placeholder?: string
  autoFocus?: boolean
  maxLength?: number
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
  type?: 'text' | 'number' | 'email' | 'tel'
  icon?: IconType
  iconType?: Type
  /**
   * While true hover state will not show and focus state will be always on
   */
  fixedFocusState?: boolean
  autoComplete?: 'on' | 'off'
}

export interface InputProps extends InputComponentProps {
  label?: string
  hasError?: boolean
  errorMessage?: string
  tooltip?: string
  backgroundColor?: ResponsiveProp<InputBackgroundColor>
  textarea?: boolean
  maxLength?: number
}
