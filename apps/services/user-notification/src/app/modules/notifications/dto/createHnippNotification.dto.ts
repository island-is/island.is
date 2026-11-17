import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/core'
import { Type } from 'class-transformer'

export class HnippNotificationOriginalRecipientDto {
  @IsString()
  @ApiProperty({ example: '1234567890' })
  nationalId!: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  name?: string

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  subjectId?: string
}

export class ArgumentDto {
  @IsString()
  @ApiProperty({ example: 'key' })
  key!: string

  @IsString()
  @ApiProperty({ example: 'value' })
  value!: string
}

/**
 * Public DTO for creating notifications via API
 * This is what external consumers should use
 */
export class CreateHnippNotificationDto {
  @IsNationalId()
  @ApiProperty({ example: '1234567890' })
  recipient!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '1234567890' })
  senderId?: string

  @IsOptional()
  @Type(() => HnippNotificationOriginalRecipientDto)
  @ApiPropertyOptional()
  onBehalfOf?: HnippNotificationOriginalRecipientDto

  @IsString()
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Marks that this notification is a inbox notification that is marked as urgent.',
  })
  @IsBoolean()
  urgent?: boolean

  @IsArray()
  @Type(() => ArgumentDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [ArgumentDto],
    example: [
      { key: 'organization', value: 'Hnipp Test Crew' },
      { key: 'documentId', value: 'abcd-abcd-abcd-abcd' },
    ],
  })
  args!: ArgumentDto[]

  @IsOptional()
  @IsISO8601({ strict: true })
  @Matches(/T\d{2}:\d{2}/, {
    message: 'deadline must include a time, e.g. 2026-12-01T16:00:00',
  })
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-12-01T16:00:00Z',
    description:
      'Deadline related to the notification, e.g. when an office closes, for display only. ISO 8601 date and time. A value without a UTC offset is interpreted as Icelandic time, which is UTC+0 all year (no daylight saving time). An explicit offset (e.g. Z or +00:00) is honoured. Returned in UTC.',
  })
  deadline?: string
}

export class InternalCreateHnippNotificationDto extends CreateHnippNotificationDto {
  @IsOptional()
  @IsString()
  rootMessageId?: string

  /**
   * When true, the SMS opt-in check is overridden and the guardians of children under 16 should receive SMS
   * regardless of their own SMS opt-in status.
   */
  @IsOptional()
  @IsBoolean()
  forceSmsToMinorGuardian?: boolean
}
