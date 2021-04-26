import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator'
import { IsEndorsementValidator } from '../../endorsementValidator/endorsementValidator.decorator'
import { ValidationRule } from '../../endorsementValidator/endorsementValidator.service'
export class ValidationRuleDto {
  @IsEnum(ValidationRule)
  type!: ValidationRule

  @IsOptional()
  @IsObject()
  @IsEndorsementValidator()
  value?: string
}
