import { ApiProperty } from '@nestjs/swagger'

export class CreateSectionDto {
  @ApiProperty()
  formId!: string
}
