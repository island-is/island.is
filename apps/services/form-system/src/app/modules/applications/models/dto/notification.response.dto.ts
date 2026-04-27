import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationErrorDto } from '../../../screens/models/dto/validationError.dto'
import { ApplicationXroadFieldDto } from './application.xroad.dto'

export class NotificationResponseDto {
  @ApiPropertyOptional({ type: () => ScreenDto })
  screen?: ScreenDto

  @ApiPropertyOptional({ type: [ApplicationXroadFieldDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationXroadFieldDto)
  fields?: ApplicationXroadFieldDto[]

  @ApiHideProperty()
  operationSuccessful?: boolean

  @ApiPropertyOptional({ type: ValidationErrorDto })
  @Type(() => ValidationErrorDto)
  @IsOptional()
  @ValidateNested()
  screenError?: ValidationErrorDto
}
