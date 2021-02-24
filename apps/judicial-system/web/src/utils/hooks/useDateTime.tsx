import { useEffect, useState } from 'react'
import { validate } from '../validate'

interface Parameters {
  date?: string
  time?: string
}

const useDateTime = ({ date, time }: Parameters) => {
  const [isValidDate, setIsValidDate] = useState<{
    isValid: boolean
    errorMessage: string
  }>()
  const [isValidTime, setIsValidTime] = useState<{
    isValid: boolean
    errorMessage: string
  }>()

  useEffect(() => {
    const dateHasValue = validate(date || '', 'empty')
    const timeHasValue = validate(time || '', 'empty')
    const timeIsFormattedCorrectly = validate(time || '', 'time-format')

    setIsValidDate(dateHasValue)
    setIsValidTime(timeHasValue && timeIsFormattedCorrectly)
  }, [date, time])

  return { isValidDate, isValidTime }
}

export default useDateTime
