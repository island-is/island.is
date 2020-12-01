import React from 'react'
import { Input } from '../../Input/Input'

export type FilterInputChangeEvent = {
  value: string
}

export interface FilterInputProps {
  name: string,
  id?: string,
  placeholder?: string,
  onChange: (event: FilterInputChangeEvent) => void
}

export const FilterInput: React.FC<FilterInputProps> = ({
  name,
  id = name,
  placeholder = '',
  onChange
}) => {
  return (
    <Input
      id={id}
      name={name}
      placeholder={placeholder}
      icon="search"
      onChange={(event) => {
        onChange({value: event.target.value})
      }} />
  )
}