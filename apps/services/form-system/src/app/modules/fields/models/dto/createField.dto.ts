import { ApiProperty } from '@nestjs/swagger'

export class CreateFieldDto {
  @ApiProperty()
  screenId!: string
}
