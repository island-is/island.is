import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { ExamCategoryType, ExamineeType } from '../../lib/dataSchema'
import { useFormContext } from 'react-hook-form'
import { TrueOrFalse } from '../../utils/enums'
import { getValueViaPath } from '@island.is/application/core'

export const ExamineeValidation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { setBeforeSubmitCallback, application } = props
  const { getValues, setValue } = useFormContext()

  setBeforeSubmitCallback?.(async () => {
    const examinees: ExamineeType = getValues('examinees')
    const examCategories = getValueViaPath<ExamCategoryType[]>(
      application.answers,
      'examCategories',
    )

    const allNationalIds = examinees.map(
      (examinee) => examinee.nationalId.nationalId,
    )

    if (examCategories && Array.isArray(examCategories)) {
      const filteredExamCategories = examCategories.filter(
        (cat) => cat.nationalId && allNationalIds.includes(cat.nationalId),
      )
      setValue('examCategories', filteredExamCategories)
    }

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
