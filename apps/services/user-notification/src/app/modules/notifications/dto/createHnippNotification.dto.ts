import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/core'
import { Type } from 'class-transformer'

export class HnippNotificationOriginalRecipientDto {
  @IsString()
  @ApiProperty({ example: '1234567890' })
  nationalId!: string

  @IsString()
  @ApiProperty()
  name!: string

  @IsString()
  @ApiProperty()
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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Root message ID to track the original notification when creating delegation messages',
  })
  rootMessageId?: string

  @IsString()
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

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
  @IsString()
  @ApiPropertyOptional({
    example: 'Email subject line',
    description:
      'Optional subject line for email notifications. If not provided, the template title will be used.',
  })
  subject?: string
}
