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

    setIsValidDate(dateHasValue)
  }, [date])

  useEffect(() => {
    const timeHasValue = validate(time || '', 'empty')
    const timeIsFormattedCorrectly = validate(time || '', 'time-format')

    setIsValidTime(timeHasValue && timeIsFormattedCorrectly)
  }, [time])

  return { isValidDate, isValidTime }
}

export default useDateTime
