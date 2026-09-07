import {
  AttachmentReplyViewDto,
  BooleanReplyViewDto,
  DateReplyViewDto,
  ListReplyDto,
  NumberReplyViewDto,
  StringReplyViewDto,
  TableReplyViewDto,
} from '@island.is/clients/health-directorate'

export type QuestionnaireReply =
  | AttachmentReplyViewDto
  | BooleanReplyViewDto
  | DateReplyViewDto
  | ListReplyDto
  | NumberReplyViewDto
  | StringReplyViewDto
  | TableReplyViewDto
