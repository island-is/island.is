import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoriesAndInstructors,
  Examinees,
  ExamLocation,
} from '@island.is/application/templates/aosh/practical-exam'
import { FormValue } from '@island.is/application/types'

export const getExamLocation = (answers: FormValue) => {
  return getValueViaPath<ExamLocation>(answers, 'examLocation')
}

export const getExaminees = (answers: FormValue) => {
  return getValueViaPath<Examinees>(answers, 'examinees')
}

export const getExamcategories = (answers: FormValue) => {
  return getValueViaPath<ExamCategoriesAndInstructors[]>(
    answers,
    'examCategories',
  )
}
