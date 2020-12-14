import { theme } from '@island.is/island-ui/theme'
import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
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
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Input
      id={id}
      name={name}
      placeholder={placeholder}
      backgroundColor={isMobile ? 'blue' : 'white'}
      size="sm"
      icon="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
