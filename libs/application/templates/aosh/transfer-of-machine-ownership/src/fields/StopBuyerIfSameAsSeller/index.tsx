import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { doSellerAndBuyerHaveSameNationalId } from '../../utils'

export const StopBuyerIfSameAsSeller: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application, setBeforeSubmitCallback } = props

  setBeforeSubmitCallback?.(async () => {
    if (doSellerAndBuyerHaveSameNationalId(application.answers)) {
      return [false, '']
    }
    return [true, null]
  })

  return null
}
