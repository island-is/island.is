import template from './lib/PracticalExamTemplate'
import { ExamLocationType, PracticalExamAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields/')

export type PracticalExam = PracticalExamAnswers
export type ExamLocation = ExamLocationType

export default template
