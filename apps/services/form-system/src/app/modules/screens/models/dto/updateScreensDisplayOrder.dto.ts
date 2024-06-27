import { ApiProperty } from '@nestjs/swagger'
import { ScreenDisplayOrderDto } from './screenDisplayOrder.dto'

export class UpdateScreensDisplayOrderDto {
  @ApiProperty({ type: [ScreenDisplayOrderDto] })
  screensDisplayOrderDto!: ScreenDisplayOrderDto[]
}
