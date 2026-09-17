import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { YES } from '@island.is/application/core'

const ChangeApplicationInfoFlag: FC = () => {
  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('changeApplicationInfo', YES)
  }, [setValue])

  return null
}

export default ChangeApplicationInfoFlag
