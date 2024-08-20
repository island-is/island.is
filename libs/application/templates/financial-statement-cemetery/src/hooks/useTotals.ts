import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getTotal } from '../utils/helpers'

const useTotals = (key: string): [() => void, number] => {
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

export { useTotals }
