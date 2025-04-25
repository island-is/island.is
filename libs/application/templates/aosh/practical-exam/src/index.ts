import template from './lib/PracticalExamTemplate'
import {
  ExamCategoryType,
  ExamineeType,
  ExamLocationType,
  InstructorType,
  PaymentArrangementType,
  PracticalExamAnswers,
} from './lib/dataSchema'

export const getFields = () => import('./fields/')

export type PracticalExam = PracticalExamAnswers
export type ExamLocation = ExamLocationType
export type Examinees = ExamineeType
export type ExamCategoriesAndInstructors = ExamCategoryType
export type Instructors = InstructorType
export type PaymentArrangement = PaymentArrangementType

export default template
