import { useState, useCallback, useEffect } from 'react'
import { valueToNumber } from '../lib/utils'

interface RepeaterField {
  enabled?: boolean
  [key: string]: unknown
}

/**
 * Custom hook for calculating and managing totals in repeater components.
 * Automatically recalculates when fields change.
 *
 * @param id - The field ID/path
 * @param getValues - Form's getValues function
 * @param fields - The repeater fields array
 * @param getFieldValue - Function to extract the numeric value from a field
 * @returns Object containing total value and calculateTotal function
 */
export const useRepeaterTotal = <T extends RepeaterField>(
  id: string,
  getValues: (name: string) => unknown,
  fields: T[],
  getFieldValue: (field: T) => string | undefined,
) => {
  const [total, setTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    const values = getValues(id) as T[] | undefined
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: T) => {
      // Only exclude items explicitly set to false; treat undefined as enabled
      if (current.enabled === false) return acc
      const currentValue = valueToNumber(getFieldValue(current) ?? '0')
      return Number(acc) + currentValue
    }, 0)

    setTotal(total)
  }, [getValues, id, getFieldValue])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  return { total, calculateTotal }
}
