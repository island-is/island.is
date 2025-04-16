import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { ExamineeInfo } from './ExamineeInfo'
import { ExamInputs } from './ExamInputs'
import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoryType,
  ExamineeType,
  InstructorType,
} from '../../lib/dataSchema'
import { Box, Text } from '@island.is/island-ui/core'
import { ExamCategoryTable } from './ExamCategoryTable'
import { useFormContext, useWatch } from 'react-hook-form'

export const ExamCategories: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setSubmitButtonDisabled } = props
  const { answers } = application
  const { trigger, getValues, setValue } = useFormContext()
  const [examineeIndex, setExamineeIndex] = useState<number>(0)
  const instructors =
    getValueViaPath<InstructorType>(answers, 'instructors') ?? []
  const examineesFromAnswers = getValueViaPath<ExamineeType>(
    answers,
    'examinees',
  )
  const [examinees, setExaminees] = useState<ExamineeType>(
    examineesFromAnswers || [],
  )
  const [maxExaminees, setMaxEmainees] = useState<number>(
    examinees?.length || 0,
  )
  const examCategoryTable = getValueViaPath<string[][]>(
    answers,
    'examCategoryTable',
  )
  const [tableData, setTableData] = useState<string[][]>(
    examCategoryTable || [],
  )

  const watchedTable: string[][] = useWatch({
    name: 'examCategoryTable',
    defaultValue: [],
  })

  const watchedCategories: string[][] = useWatch({
    name: 'examCategories',
  })

  useEffect(() => {
    // Self-invoking async function
    ;(async () => {
      try {
        const isNextEnabled = await trigger('examCategories')
        setSubmitButtonDisabled && setSubmitButtonDisabled(!isNextEnabled)
      } catch (error) {
        setSubmitButtonDisabled && setSubmitButtonDisabled(true)
      }
    })()
  }, [watchedCategories, trigger])

  useEffect(() => {
    setTableData(watchedTable)
  }, [watchedTable])

  const onDeleteFromTable = () => {
    const examCategoriesValue: ExamCategoryType[] = getValues('examCategories')
    const examineesValue: ExamineeType = getValues('examinees')
    // Validate index
    if (
      examineeIndex < 0 ||
      examineeIndex >= examCategoriesValue.length ||
      examineeIndex >= examineesValue.length
    ) {
      console.error('Invalid index')
      return
    }

    // Update arrays
    setValue(
      'examCategories',
      examCategoriesValue.filter((_, i) => i !== examineeIndex),
    )

    setValue(
      'examinees',
      examineesValue.filter((_, i) => i !== examineeIndex),
    )

    // Optional: Update examCategoryTable if it exists
    if (tableData) {
      setValue(
        'examCategoryTable',
        tableData.filter((_, i) => i !== examineeIndex),
      )
    }
    setExaminees(examineesValue.filter((_, i) => i !== examineeIndex))
    setExamineeIndex((prev) => {
      if (prev < 1) return prev
      return prev - 1
    })
    setMaxEmainees((prev) => prev - 1)
  }

  if (!examinees) return null
  return (
    <Box>
      <ExamCategoryTable
        {...props}
        rows={tableData}
        onEdit={setExamineeIndex}
        onDelete={onDeleteFromTable}
      />
      {examineeIndex !== maxExaminees && (
        <>
          <Text variant="h5" paddingY={4}>{`Próftaki ${
            examineeIndex + 1
          } af ${maxExaminees}`}</Text>
          <ExamineeInfo
            {...props}
            name={examinees[examineeIndex].nationalId.name}
            nationalId={examinees[examineeIndex].nationalId.nationalId}
          />
          {/* Need to loop here for each examinee */}
          <ExamInputs
            {...props}
            tableData={tableData}
            setTable={setTableData}
            instructors={instructors}
            idx={examineeIndex}
            onSave={() =>
              setExamineeIndex((prev) => {
                return prev + 1
              })
            }
          />
        </>
      )}
    </Box>
  )
}
