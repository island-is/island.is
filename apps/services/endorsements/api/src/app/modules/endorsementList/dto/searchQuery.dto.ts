import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SearchQueryDto {
  @ApiProperty({ required: true })
  @IsString()
  search_query!: string
}
