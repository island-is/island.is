


export interface ArgItem {
  key: string;
  value: string;
}

export interface Message {
  title: string;
  body: string;
  dataCopy: string;
  clickAction: string;
}


export interface CreateNotificationDto {
  cursor: number;
  messageId: string;
  recipient: string;
  templateId: string;
  args: ArgItem[];
  created: Date;
  updated: Date;
  status: string;
  message:Message;
}