import { ApiProperty } from '@nestjs/swagger'
import { IsJSON, IsNotEmpty } from 'class-validator'

export class UpdateValueDto {
  @IsNotEmpty()
  @IsJSON()
  @ApiProperty()
  json!: string
}
