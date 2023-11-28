import { PageInfoDto } from '@island.is/nest/pagination'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsString,
  IsInt,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export class ExtendedPaginationDto extends PageInfoDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'locale',
    type: 'string',
  })
  @IsString()
  locale?: string
}

export class ArgItem {
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
  messageId!: string

  @ApiProperty({ example: 'recipient-uuid' })
  @IsString()
  recipient!: string

  @ApiProperty({ example: 'template-uuid' })
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

  @ApiProperty({ example: 'uuid-message-id' })
  @IsString()
  messageId!: string

  @ApiProperty({ example: 'hnipp stofnun' })
  @IsString()
  sender!: string
  title!: string
  body!: string
  dataCopy!: string | null | undefined
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

  @ApiProperty({ required: false, example: 'Some data copy' })
  @IsOptional()
  @IsString()
  dataCopy?: string

  @ApiProperty({ required: false, example: 'click/action' })
  @IsOptional()
  @IsString()
  clickAction?: string
}
export class ExtendedNotificationDto {
  @ApiProperty({
    example: {
      /* ... */
    },
  })
  @ValidateNested()
  @Type(() => Message)
  message!: Message
}

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
