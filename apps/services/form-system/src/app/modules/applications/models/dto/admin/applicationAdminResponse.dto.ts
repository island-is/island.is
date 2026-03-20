import { ApiProperty } from '@nestjs/swagger'
import { ApplicationAdminDto } from './applicationAdmin.dto'

export class ApplicationAdminResponseDto {
  @ApiProperty({ type: [ApplicationAdminDto] })
  rows!: ApplicationAdminDto[]

  @ApiProperty()
  count!: number
}
