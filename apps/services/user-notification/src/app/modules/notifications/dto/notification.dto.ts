import { PageInfoDto, PaginationDto } from '@island.is/nest/pagination'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsString,
  IsInt,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { NotificationStatus } from '../notification.model'

// export enum NotificationStatus {
//   READ = 'read',
//   UNREAD = 'unread',
// }

export class ExtendedPaginationDto extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'locale',
    type: 'string',
  })
  @IsString()
  locale?: string
}

class ArgItem {
  @ApiProperty({ example: 'key1' })
  @IsString()
  key!: string

  @ApiProperty({ example: 'value1' })
  @IsString()
  value!: string
}

export class NotificationDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  id!: number

  @ApiProperty({ example: 'uuid-message-id' })
  @IsString()
  @IsUUID()
  messageId!: string

  @ApiProperty({ example: '1234567890' })
  @IsString()
  recipient!: string

  @ApiProperty({ example: 'HNIPP.ORG.CONTEXT' })
  @IsString()
  templateId!: string

  @ApiProperty({ type: [ArgItem], example: [{ key: 'key1', value: 'value1' }] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArgItem)
  args!: ArgItem[]

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  created!: Date

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  updated!: Date

  @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.UNREAD })
  @IsEnum(NotificationStatus)
  status!: NotificationStatus
}

export class RenderedNotificationDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  id!: number

  @ApiProperty({ example: 'message-uuid' })
  @IsString()
  @IsUUID()
  messageId!: string

  @ApiProperty({ example: 'Catchy notification title' })
  @IsString()
  title!: string
  @ApiProperty({ example: 'Compelling nofication body' })
  @IsString()
  body!: string
  @ApiProperty({ example: 'Extra body text for further viewing' })
  @IsString()
  dataCopy!: string | null | undefined
  @ApiProperty({ example: '//inbox/document-uuid' })
  @IsString()
  clickAction!: string | null | undefined

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  created!: Date

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  updated!: Date

  @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.UNREAD })
  @IsEnum(NotificationStatus)
  status!: NotificationStatus
}

export class Message {
  @ApiProperty({ example: 'Notification Title' })
  @IsString()
  title!: string

  @ApiProperty({ example: 'Notification body text' })
  @IsString()
  body!: string

  @ApiPropertyOptional({ example: 'Some data copy' })
  @IsOptional()
  @IsString()
  dataCopy?: string

  @ApiPropertyOptional({ example: 'click/action' })
  @IsOptional()
  @IsString()
  clickAction?: string
}
// export class ExtendedNotificationDto {
//   @ApiProperty({
//     example: {
//       /* ... */
//     },
//   })
//   @ValidateNested()
//   @Type(() => Message)
//   message!: Message
// }

export class PaginatedNotificationDto {
  @ApiProperty({ example: 100 })
  @IsInt()
  totalCount!: number

  @ApiProperty({
    type: [RenderedNotificationDto],
    example: [
      {
        /* ... */
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RenderedNotificationDto)
  data!: RenderedNotificationDto[]

  @ApiProperty({
    example: {
      /* ... */
    },
  })
  @ValidateNested()
  @Type(() => PageInfoDto)
  pageInfo!: PageInfoDto
}

export class UpdateNotificationDto {
  @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.READ })
  @IsEnum(NotificationStatus)
  status!: NotificationStatus
}
