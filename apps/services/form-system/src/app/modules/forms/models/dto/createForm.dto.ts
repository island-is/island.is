import { ApiProperty } from '@nestjs/swagger'

export class CreateFormDto {
  @ApiProperty()
  organizationId!: string
}
