import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApplicationTypes } from '@island.is/application/types'
import { ApiProperty } from '@nestjs/swagger'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationTypes)
  @ApiProperty({ enum: ApplicationTypes })
  readonly typeId!: ApplicationTypes
}
