import React from 'react'
import { ResponsiveProp } from '../../../utils/responsiveProp'
import { InputBackgroundColor } from '../../Input/types'
import { Input } from '../../Input/Input'

export interface FilterInputProps {
  name: string
  id?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  backgroundColor?: ResponsiveProp<InputBackgroundColor>
}

export const FilterInput: React.FC<FilterInputProps> = ({
  name,
  id = name,
  placeholder = '',
  value = '',
  onChange,
  onKeyDown,
  backgroundColor = ['blue', 'blue', 'white'],
}) => {
  return (
    <Input
      id={id}
      name={name}
      placeholder={placeholder}
      backgroundColor={backgroundColor}
      size="sm"
      icon="search"
      iconType="outline"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
    />
  )
}
