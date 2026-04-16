import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { ValidationErrorDto } from '@/app/modules/screens/models/dto/validationError.dto'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class NotificationResponseDto {
  @ApiPropertyOptional({ type: () => ScreenDto })
  screen?: ScreenDto

  @ApiHideProperty()
  operationSuccessful?: boolean

  @ApiPropertyOptional({ type: ValidationErrorDto })
  @Type(() => ValidationErrorDto)
  @IsOptional()
  @ValidateNested()
  screenError?: ValidationErrorDto
}
