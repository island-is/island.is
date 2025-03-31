import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { ExamineeType } from '../../lib/dataSchema'
import { useFormContext } from 'react-hook-form'
import { TrueOrFalse } from '../../utils/enums'

export const ExamineeValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()

  setBeforeSubmitCallback?.(async () => {
    const examinees: ExamineeType = getValues('examinees')

    const isThereAnInvalidExaminee = examinees?.some(
      (examinee) =>
        examinee.disabled === TrueOrFalse.true ||
        examinee.disabled === undefined,
    )

    if (!isThereAnInvalidExaminee) {
      return [true, null]
    }

    return [false, '']
  })

  return null
}
