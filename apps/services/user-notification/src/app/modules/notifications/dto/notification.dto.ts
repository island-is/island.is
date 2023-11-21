export interface ArgItem {
  key: string;
  value: string;
}

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread'
}

export interface NotificationDTO {
  cursor?: number;
  messageId?: string;
  recipient: string;
  templateId: string;
  args: ArgItem[];
  created?: Date;
  updated?: Date;
  status?: NotificationStatus;
}