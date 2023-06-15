import { useState } from 'react'

interface UseNationalId {
  nationalId: string
  handleInputChange: (value: string) => void
  isValid: boolean
  formatNationalId: (value: string) => string
}

export const useNationalId = (): UseNationalId => {
  const [nationalId, setNationalId] = useState('')
  const [isValid, setIsValid] = useState(false)
  const formatNationalId = (value: string) => {
    if (value.length > 6) {
      return `${value.slice(0, 6)}-${value.slice(6)}`.slice(0, 11)
    } else {
      return value
    }
  }

  const handleInputChange = (value: string) => {
    const formattedValue = value.replace('-', '')
    setNationalId(formatNationalId(formattedValue))
    setIsValid(formattedValue.length === 10)
  }

  return { nationalId, handleInputChange, isValid, formatNationalId }
}
