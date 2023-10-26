import { ModeOfDelivery } from '@island.is/university-gateway'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateApplicationDto {
  @IsUUID()
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  @IsEnum(ModeOfDelivery)
  @ApiProperty({
    description: 'What mode of delivery was selected in the application',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  modeOfDelivery!: ModeOfDelivery

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Extra data that should follow application',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  extraData?: string
}
