import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/core'
import { Type } from 'class-transformer'

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
}
