import { PaginationDto } from '@island.is/nest/pagination'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

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
