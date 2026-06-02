import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationErrorDto } from '../../../screens/models/dto/validationError.dto'
import { ApplicationJsonFieldDto } from './application.json.dto'

export class NotificationResponseDto {
  @ApiPropertyOptional({ type: () => ScreenDto })
  screen?: ScreenDto

  @ApiPropertyOptional({ type: [ApplicationJsonFieldDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationJsonFieldDto)
  fields?: ApplicationJsonFieldDto[]

  @ApiHideProperty()
  operationSuccessful?: boolean

  @ApiPropertyOptional({ type: ValidationErrorDto })
  @Type(() => ValidationErrorDto)
  @IsOptional()
  @ValidateNested()
  screenError?: ValidationErrorDto
}
