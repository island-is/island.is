import React from 'react'
import { ResponsiveProp } from '../../../utils/responsiveProp'
import { InputBackgroundColor, InputIcon, InputButton } from '../../Input/types'
import { Input } from '../../Input/Input'

export interface FilterInputProps {
  name: string
  id?: string
  label?: string
  placeholder?: string
  value: string
  button?: Omit<InputButton, 'name' | 'type'>
  onChange: (value: string) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  backgroundColor?: ResponsiveProp<InputBackgroundColor>
  loading?: boolean
  maxLength?: number
  error?: string
  size?: 'xs' | 'sm' | 'md'
}

const icon: InputIcon = { name: 'search', type: 'outline' }

export const FilterInput: React.FC<
  React.PropsWithChildren<FilterInputProps>
> = ({
  name,
  id = name,
  label,
  placeholder = '',
  value = '',
  button,
  onChange,
  onKeyDown,
  backgroundColor = ['blue', 'blue', 'white'],
  loading,
  maxLength,
  error,
  size = 'xs',
}) => {
  return (
    <Input
      id={id}
      name={name}
      label={label}
      placeholder={placeholder}
      backgroundColor={backgroundColor}
      size={size}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      buttons={button && [{ ...icon, ...button }]}
      {...(button ? {} : { icon })}
      loading={loading}
      maxLength={maxLength}
      hasError={error !== undefined}
      errorMessage={error}
    />
  )
}
