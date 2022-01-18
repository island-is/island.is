import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApplicationTypes } from '@island.is/application/core'
import { ApiProperty } from '@nestjs/swagger'

export class CreateApplicationDto {
  @IsEnum(ApplicationTypes)
  @ApiProperty({ enum: ApplicationTypes })
  readonly typeId!: ApplicationTypes
}
