import { IsOptional, IsString, IsDate } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateEndorsementListDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty({ type: String, nullable: true, required: false })
  @IsOptional()
  @IsString()
  description = ''

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  closedDate!: Date

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsDate()
  openedDate!: Date
}
