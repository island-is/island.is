import { ApiProperty } from '@nestjs/swagger'
import { IsOptional,IsString } from 'class-validator'

import { PaginationDto } from '@island.is/nest/pagination'

export class PaginationWithNationalIdsDto extends PaginationDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '0123456789',
    description: 'nationalId of Personal Representative',
  })
  @IsString()
  personalRepresentativeId?: string

  @IsOptional()
  @ApiProperty({
    required: false,
    example: '0123456789',
    description: 'nationalId of Personal Representative',
  })
  @IsString()
  representedPersonId?: string
}
