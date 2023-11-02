import { useMemo } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

const highestFullTimeValueFromSeconds = (
  seconds: number,
): { value: number; unit: string; isExact: boolean } => {
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  if (years >= 1) {
    return {
      value: Math.floor(years),
      unit: 'years',
      isExact: years % 1 === 0,
    }
  }

  if (months >= 1) {
    return {
      value: Math.floor(months),
      unit: 'months',
      isExact: months % 1 === 0,
    }
  }
  if (days >= 1) {
    return {
      value: Math.floor(days),
      unit: 'days',
      isExact: days % 1 === 0,
    }
  }
  if (hours >= 1) {
    return {
      value: Math.floor(hours),
      unit: 'hours',
      isExact: hours % 1 === 0,
    }
  }
  if (minutes >= 1) {
    return {
      value: Math.floor(minutes),
      unit: 'minutes',
      isExact: minutes % 1 === 0,
    }
  }
  return {
    value: Math.floor(seconds),
    unit: 'seconds',
    isExact: seconds % 1 === 0,
  }
}

export const useReadableSeconds = (seconds?: number): string | null => {
  const { formatMessage } = useLocale()

  return useMemo(() => {
    if (typeof seconds !== 'number' || Number.isNaN(seconds)) {
      return null
    }

    return formatMessage(m.readableSeconds, {
      sec: seconds,
      ...highestFullTimeValueFromSeconds(seconds),
    })
  }, [formatMessage, seconds])
}
