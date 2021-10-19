import {
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateEndorsementListDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  description = ''

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  closedDate!: Date

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  openedDate!: Date

}
