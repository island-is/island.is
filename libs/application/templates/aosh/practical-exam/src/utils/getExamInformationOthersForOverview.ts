import { getValueViaPath } from '@island.is/application/core'
import { FormValue, TableData } from '@island.is/application/types'
import { ExamCategoriesAndInstructors, Examinees } from '..'
import { overview } from '../lib/messages'

export const getExaminees = (answers: FormValue): Examinees | undefined => {
  return getValueViaPath<Examinees>(answers, 'examinees')
}

export const getExamcategories = (
  answers: FormValue,
): ExamCategoriesAndInstructors[] | undefined => {
  return getValueViaPath<ExamCategoriesAndInstructors[]>(
    answers,
    'examCategories',
  )
}

export const getExamInformationOthersForOverview = (
  answers: FormValue,
): TableData => {
  const examinees = getExaminees(answers)
  const examCategories = getExamcategories(answers)

  if (!examinees || !examCategories) return { header: [], rows: [] }

  const tableData = examinees
    ?.map((examinee, index) => {
      return examCategories[index].categories.map((cat, idx) => {
        return {
          name: examinee.nationalId.name,
          examCategory: cat.label,
          instructor: examCategories[index].instructor[idx].label,
        }
      })
    })
    .flat()

  return {
    header: [
      overview.table.examinee,
      overview.table.examCategory,
      overview.table.instructor,
    ],
    rows: tableData.map((data) => {
      return [data.name, data.examCategory, data.instructor]
    }),
  }
}
