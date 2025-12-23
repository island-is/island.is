import {
  BooleanQuestionDto,
  StringQuestionDto,
  DateQuestionDto,
  NumberQuestionDto,
  ListQuestionDto,
  AttachmentQuestionDto,
  TableQuestionDto,
  NumberTriggerDto,
  ListTriggerDto,
  BooleanTriggerDto,
} from '@island.is/clients/health-directorate'

// Type definitions matching the Health Directorate API
export type StringReply = {
  questionId: string
  answer: string
}

export type BooleanReply = {
  questionId: string
  answer: boolean
}

export type DateReply = {
  questionId: string
  answer: string // Date in ISO format
}

export type NumberReply = {
  questionId: string
  answer: number
}

export type ListReply = {
  questionId: string
  values: Array<{
    id: string
    answer: string
  }>
}

export type Reply =
  | StringReply
  | BooleanReply
  | DateReply
  | NumberReply
  | ListReply

export type TableReply = {
  questionId: string
  rows: Reply[][]
}

export type HealthDirectorateQuestionDto =
  | BooleanQuestionDto
  | StringQuestionDto
  | DateQuestionDto
  | NumberQuestionDto
  | ListQuestionDto
  | AttachmentQuestionDto
  | TableQuestionDto

export type HealthDirectorateQuestionTriggers =
  | NumberTriggerDto
  | ListTriggerDto
  | BooleanTriggerDto
