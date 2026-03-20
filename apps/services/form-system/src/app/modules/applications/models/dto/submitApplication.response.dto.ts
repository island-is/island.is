import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ValidationErrorDto } from '../../../screens/models/dto/validationError.dto'

export class SubmitApplicationResponseDto {
  @ApiProperty()
  submissionFailed!: boolean

  @ApiPropertyOptional({ type: ValidationErrorDto })
  validationError?: ValidationErrorDto
}
