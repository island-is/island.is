import {
  AttachmentReplyViewDto,
  BooleanReplyViewDto,
  DateReplyViewDto,
  GridReplyViewDto,
  ListReplyViewDto,
  NumberReplyViewDto,
  StringReplyViewDto,
  TableReplyViewDto,
} from '@island.is/clients/health-directorate'

export type QuestionnaireReply =
  | AttachmentReplyViewDto
  | BooleanReplyViewDto
  | DateReplyViewDto
  | GridReplyViewDto
  | ListReplyViewDto
  | NumberReplyViewDto
  | StringReplyViewDto
  | TableReplyViewDto
