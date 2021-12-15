import { IsOptional, IsString } from 'class-validator'
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
  @Type(() => Date)
  closedDate!: Date

  @ApiProperty({ type: Date })
  @Type(() => Date)
  openedDate!: Date
}
