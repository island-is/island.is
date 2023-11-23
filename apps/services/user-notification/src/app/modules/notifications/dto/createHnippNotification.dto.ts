import { IsArray, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/core'
import { Type } from 'class-transformer'

class ArgumentDto {
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

  @IsString()
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

  @IsArray()
  @Type(() => ArgumentDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    example: [
      { key: 'organization', value: 'Hnipp Test Crew' },
      { key: 'documentId', value: 'abcd-abcd-abcd-abcd' },
    ],
  })
  args!: ArgumentDto[]
}
