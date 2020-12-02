import React from 'react'
import { Input } from '../../Input/Input'

export interface FilterInputProps {
  name: string
  id?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const FilterInput: React.FC<FilterInputProps> = ({
  name,
  id = name,
  placeholder = '',
  value = '',
  onChange,
}) => {
  return (
    <Input
      id={id}
      name={name}
      placeholder={placeholder}
      size="sm"
      icon="search"
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}
