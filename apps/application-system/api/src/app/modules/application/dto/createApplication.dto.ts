import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

import { ApplicationTypes } from '@island.is/application/core'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationTypes)
  @ApiProperty({ enum: ApplicationTypes })
  readonly typeId!: ApplicationTypes
}
