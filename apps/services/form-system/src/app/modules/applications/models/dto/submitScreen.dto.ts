import { ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class SubmitScreenDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  applicationId?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ScreenDto)
  @ApiPropertyOptional({ type: ScreenDto })
  screenDto?: ScreenDto
}
