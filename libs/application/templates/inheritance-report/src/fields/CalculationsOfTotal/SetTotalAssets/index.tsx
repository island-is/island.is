import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { calculateTotalAssets } from '../../../lib/utils/calculateTotalAssets'

export const SetTotalAssets: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { answers } = application
  const { setValue } = useFormContext()

  const total = calculateTotalAssets(answers)

  useEffect(() => {
    setValue('assets.assetsTotal', total)
  }, [total, setValue])

  return null
}

export default SetTotalAssets
