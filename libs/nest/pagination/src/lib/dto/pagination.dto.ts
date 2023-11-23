import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Limits the number of results in a request.',
    type: 'number',
    default: 10,
  })
  @IsNumberString()
  limit?: number

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The value of `startCursor` from the previous response pageInfo to query the previous page of `limit` number of data items.',
    type: 'string',
  })
  @IsString()
  before?: string

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The value of `endCursor` from the response to query the next page of `limit` number of data items.',
    type: 'string',
  })
  @IsString()
  after?: string

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The value of `endCursor` from the response to query the next page of `limit` number of data items.',
    type: 'string',
  })
  @IsString()
  locale?: string

}
