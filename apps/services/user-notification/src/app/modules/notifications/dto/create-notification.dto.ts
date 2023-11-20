// import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

// export class CreateNotificationDto {
//   @IsNotEmpty()
//   @IsString()
//   title!: string;

//   @IsNotEmpty()
//   @IsString()
//   message!: string;

//   @IsBoolean()
//   read!: boolean;
// }


export interface ArgItem {
  key: string;
  value: string;
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
}