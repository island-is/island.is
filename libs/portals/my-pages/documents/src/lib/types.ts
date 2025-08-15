import {
  DocumentDetails,
  DocumentV2Content,
  DocumentV2Action,
  DocumentComment,
  DocumentTicket,
  DocumentReply,
} from '@island.is/api/schema'

type ActiveDoc = {
  id: string
  subject: string
  date: string
  sender: string
  downloadUrl: string
  img?: string
  categoryId?: string
  senderNatReg?: string
  actions?: Array<DocumentV2Action>
  alert?: DocumentV2Action
}

export type ActiveDocumentType = {
  document: DocumentDetails
} & ActiveDoc

export type ActiveDocumentType2 = {
  document: Partial<DocumentV2Content>
} & ActiveDoc

export interface Reply extends DocumentTicket {
  comments?: DocumentComment[]
}

export interface PostReply extends DocumentReply {
  body: string
}

export interface ReplyState {
  replyable?: boolean
  replyOpen?: boolean
  replies?: Reply
  reply?: PostReply
  closedForMoreReplies?: boolean
}
