import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

export class FindSignatureDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty()
  listId?: string
}
