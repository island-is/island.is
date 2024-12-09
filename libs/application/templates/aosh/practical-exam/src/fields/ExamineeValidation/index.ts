import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

export const ExamineeValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setBeforeSubmitCallback } = props

  setBeforeSubmitCallback?.(async () => {
    // if (true) {
    //   return [false, '']
    // }

    return [true, null]
  })

  return null
}
