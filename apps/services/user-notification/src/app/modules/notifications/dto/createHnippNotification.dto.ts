import { IsArray, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'

export class CreateHnippNotificationDto {
  @IsNationalId()
  @ApiProperty({ example: '1234567890' })
  recipient!: string

  @IsString()
  @ApiProperty({ example: 'HNIPP.POSTHOLF.NEW_DOCUMENT' })
  templateId!: string

  @IsArray()
  @ApiProperty({ example: ['arg1', 'arg2'] })
  args!: string[]
}
