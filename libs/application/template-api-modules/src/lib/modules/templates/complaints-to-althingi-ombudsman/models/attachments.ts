export interface Attachment {
  name: string
  content: string
  type?: AttachmentType ////type Kvörtun - Fylgiskjal
}

export enum AttachmentType {
  COMPLAINT = 'Kvörtun',
  OTHER = 'Other',
  POWEROFATTORNEY = 'Umboð',
}
