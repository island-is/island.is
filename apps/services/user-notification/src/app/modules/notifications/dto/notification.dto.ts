import { PageInfoDto, PaginationDto } from '@island.is/nest/pagination'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsInt,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator'
import { Type } from 'class-transformer'
import type { Locale } from '@island.is/shared/types'

export class ExtendedPaginationDto extends PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'locale',
    type: 'string',
  })
  @IsString()
  locale!: Locale
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

  @ApiProperty({ example: false })
  @IsBoolean()
  read!: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  seen!: boolean
}

export class RenderedNotificationDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  id!: number

  @ApiProperty({ example: 'message-uuid' })
  @IsString()
  @IsUUID()
  messageId!: string

  @ApiProperty({ example: '1234567890' })
  @IsString()
  senderId!: string

  @ApiProperty({ example: 'Catchy notification title' })
  @IsString()
  title!: string

  @ApiProperty({ example: 'Compelling nofication body' })
  @IsString()
  externalBody!: string

  @ApiPropertyOptional({ example: 'Extra body text for further viewing' })
  @IsString()
  @IsOptional()
  internalBody?: string

  @ApiPropertyOptional({ example: 'https://island.is/minarsidur/postholf' })
  @IsString()
  @IsOptional()
  clickActionUrl?: string

  @ApiProperty({ example: '@island.is/documents' })
  @IsString()
  scope!: string

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  created!: Date

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  updated!: Date

  @ApiProperty({ example: false })
  @IsBoolean()
  read!: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  seen!: boolean
}

export class Message {
  @ApiProperty({ example: 'Notification Title' })
  @IsString()
  title!: string

  @ApiProperty({ example: 'Notification body text' })
  @IsString()
  externalBody!: string

  @ApiPropertyOptional({ example: 'Some data copy' })
  @IsOptional()
  @IsString()
  internalBody?: string
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
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  read?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  seen?: boolean
}

export class UnreadNotificationsCountDto {
  @ApiProperty({ example: 42 })
  @IsInt()
  unreadCount!: number
}

export class UnseenNotificationsCountDto {
  @ApiProperty({ example: 42 })
  @IsInt()
  unseenCount!: number
}

export class ActorNotificationDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  id!: number

  @ApiProperty({ example: 'uuid-message-id' })
  @IsString()
  @IsUUID()
  messageId!: string

  @ApiProperty({ example: 'uuid-root-message-id' })
  @IsString()
  @IsUUID()
  rootMessageId!: string

  @ApiProperty({ example: 456 })
  @IsInt()
  userNotificationId!: number

  @ApiProperty({ example: '1234567890' })
  @IsString()
  recipient!: string

  @ApiProperty({ example: '0987654321' })
  @IsString()
  onBehalfOfNationalId!: string

  @ApiProperty({ example: '@island.is/documents' })
  @IsString()
  scope!: string

  @ApiProperty({ example: new Date().toISOString() })
  @IsDate()
  created!: Date
}

export class PaginatedActorNotificationDto {
  @ApiProperty({ example: 100 })
  @IsInt()
  totalCount!: number

  @ApiProperty({
    type: [ActorNotificationDto],
    example: [
      {
        /* ... */
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorNotificationDto)
  data!: ActorNotificationDto[]

  @ApiProperty({
    example: {
      /* ... */
    },
  })
  @ValidateNested()
  @Type(() => PageInfoDto)
  pageInfo!: PageInfoDto
}
