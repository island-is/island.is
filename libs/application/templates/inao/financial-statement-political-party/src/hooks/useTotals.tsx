import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getTotal } from '@island.is/application/templates/inao/shared'

export const useTotals = (key: string): [() => void, number] => {
  const [total, setTotal] = useState(0)
  const { getValues } = useFormContext()
  const getSum = useCallback(() => {
    const values = getValues()
    const sum = getTotal(values, key)
    setTotal(sum)
  }, [key, getValues, setTotal])

  useEffect(() => {
    getSum()
  }, [getSum])

  return [getSum, total]
}
