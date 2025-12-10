import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { InstructorType } from '../../lib/dataSchema'
import { TrueOrFalse } from '../../utils/enums'
import { useFormContext } from 'react-hook-form'

export const InstructorValidation: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { setBeforeSubmitCallback } = props
  const { getValues } = useFormContext()

  setBeforeSubmitCallback?.(async () => {
    const instructors: InstructorType = getValues('instructors')

    const isThereAnInvalidInstructor = instructors?.some(
      (instructor) =>
        instructor.disabled === TrueOrFalse.true ||
        instructor.disabled === undefined,
    )

    if (!isThereAnInvalidInstructor) {
      return [true, null]
    }

    return [false, '']
  })

  return null
}
