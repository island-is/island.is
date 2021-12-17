import { PaginationDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationWithInvalidDto extends PaginationDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsBoolean()
  @Type(() => Boolean)
  includeInvalid?: boolean
}
