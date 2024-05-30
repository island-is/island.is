import { ApiProperty } from '@nestjs/swagger'

export class CreateStepDto {
  @ApiProperty()
  formId!: number
}
