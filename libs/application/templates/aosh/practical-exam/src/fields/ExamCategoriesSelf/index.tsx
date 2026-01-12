import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { ExamineeInfo } from '../Components/ExamineeInfo'
import { ExamInputs } from '../Components/ExamInputs'
import { getValueViaPath } from '@island.is/application/core'
import { ExamineeType, InstructorType } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { useFormContext, useWatch } from 'react-hook-form'
import { ExamCategoryTable } from '../Components/ExamCategoryTable'

export const ExamCategoriesSelf: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setSubmitButtonDisabled } = props
  const { answers } = application
  const { trigger } = useFormContext()
  const instructors =
    getValueViaPath<InstructorType>(answers, 'instructors') ?? []
  const examineesFromAnswers = getValueViaPath<ExamineeType>(
    answers,
    'examinees',
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

  if (!examineesFromAnswers || examineesFromAnswers.length === 0) return null
  return (
    <Box>
      <>
        {tableData && tableData.length > 0 && (
          <ExamCategoryTable
            {...props}
            rows={tableData}
            onEdit={() => null}
            onDelete={() => null}
            hideDelete={true}
            hideEdit={true}
          />
        )}
        <ExamineeInfo
          {...props}
          name={examineesFromAnswers[0].nationalId.name}
          nationalId={examineesFromAnswers[0].nationalId.nationalId}
        />
        {/* Need to loop here for each examinee */}
        <ExamInputs
          {...props}
          tableData={tableData}
          setTable={setTableData}
          instructors={instructors}
          idx={0}
          onSave={() => null}
        />
      </>
    </Box>
  )
}
