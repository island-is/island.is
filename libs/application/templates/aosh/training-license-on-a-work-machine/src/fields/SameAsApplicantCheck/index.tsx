import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { isContractor, isSameAsApplicant } from '../../utils'

export const SameAsApplicantCheck: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ ...props }) => {
  const { application, setBeforeSubmitCallback } = props

  setBeforeSubmitCallback?.(async () => {
    if (
      isSameAsApplicant(application.answers) &&
      !isContractor(application.answers)
    ) {
      return [false, '']
    }
    return [true, null]
  })

  return null
}
