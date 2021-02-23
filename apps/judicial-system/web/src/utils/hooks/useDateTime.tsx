import React, { useEffect, useState } from 'react'
import { validate } from '../validate'

const useDateTime = (date?: string, time?: string) => {
  const [isValidDate, setIsValidDate] = useState<boolean>()
  const [isValidTime, setIsValidTime] = useState<boolean>()

  useEffect(() => {
    const dateHasValue = validate(date || '', 'empty').isValid
    const timeHasValue = validate(time || '', 'empty').isValid
    const timeIsFormattedCorrectly = validate(time || '', 'time-format').isValid

    setIsValidDate(dateHasValue)
    setIsValidTime(timeHasValue && timeIsFormattedCorrectly)
  }, [date, time])

  return { isValidDate, isValidTime }
}

export default useDateTime
