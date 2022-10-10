import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getTotal } from '../lib/utils/helpers'

const useTotals = (key: string, deps: string[] = []): [() => void, number] => {
  const [total, setTotal] = useState(0)
  const { getValues } = useFormContext()

  const getSum = useCallback(() => {
    const values = getValues()
    const sum = getTotal(values, key)
    setTotal(sum)
  }, [key, getValues, setTotal, ...deps])

  useEffect(() => {
    getSum()
  }, [getSum, ...deps])

  return [getSum, total]
}

export { useTotals }
