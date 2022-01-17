import { ApiProperty } from '@nestjs/swagger'

export class CurrentApplicationResponse {
  @ApiProperty({ nullable: true })
  currentApplicationId?: string
}
