import { ApiProperty } from '@nestjs/swagger'

export class CreateScreenDto {
  @ApiProperty()
  sectionId!: string
}
