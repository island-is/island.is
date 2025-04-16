import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const getExaminees = (answers: FormValue) => {
  const examCategoryTableData = getValueViaPath<any>(
    answers,
    'examCategoryTable',
  )
  console.log('ANSWERS', answers)
  console.log('TABLE:', examCategoryTableData)

  return [examCategoryTableData]
}
