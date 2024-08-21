import { ApiProperty } from '@nestjs/swagger'
import { ScreenDisplayOrderDto } from './screenDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateScreensDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ScreenDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [ScreenDisplayOrderDto] })
  screensDisplayOrderDto!: ScreenDisplayOrderDto[]
}
