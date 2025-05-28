import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { ExamineeInfo } from '../Components/ExamineeInfo'
import { ExamInputs } from '../Components/ExamInputs'
import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoryType,
  ExamineeType,
  InstructorType,
} from '../../lib/dataSchema'
import { Box, Text } from '@island.is/island-ui/core'
import { ExamCategoryTable } from '../Components/ExamCategoryTable'
import { useFormContext, useWatch } from 'react-hook-form'

export const ExamCategoriesOthers: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
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
  }, [watchedCategories, trigger, setSubmitButtonDisabled])

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
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterOutIndex = (arr: any[]) =>
      arr.filter((_, i) => i !== examineeIndex)

    setValue('examCategories', filterOutIndex(examCategoriesValue))
    setValue('examinees', filterOutIndex(examineesValue))

    // Update examCategoryTable if it exists
    if (tableData) {
      setValue('examCategoryTable', filterOutIndex(tableData))
    }
    setExaminees(filterOutIndex(examineesValue))
    setExamineeIndex((prev) => {
      if (prev < 1) return prev
      return prev - 1
    })
    setMaxEmainees((prev) => prev - 1)
  }

  if (!examinees) return null
  return (
    <Box>
      {tableData && tableData.length > 0 && (
        <ExamCategoryTable
          {...props}
          rows={tableData}
          onEdit={setExamineeIndex}
          onDelete={onDeleteFromTable}
        />
      )}
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
