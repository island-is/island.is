import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationEventType } from '@island.is/financial-aid/shared/lib'

export class CreateApplicationEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly eventType: ApplicationEventType

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly comment?: string
}
