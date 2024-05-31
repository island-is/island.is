import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

enum DefenderChoice {
  WAIVE = 'WAIVE',
  CHOOSE = 'CHOOSE',
  DELAY = 'DELAY',
  DELEGATE = 'DELEGATE',
}
export class DefenderAssignmentDto {
  @IsNotEmpty()
  @IsEnum(DefenderChoice)
  @ApiProperty({ enum: DefenderChoice })
  defenderChoice!: DefenderChoice

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String })
  defenderNationalId?: string
}
