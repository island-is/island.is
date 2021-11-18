import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsObject, IsOptional } from 'class-validator'
import { IsEndorsementValidator } from '../../endorsementValidator/endorsementValidator.decorator'
import { ValidationRule } from '../../endorsementValidator/endorsementValidator.service'
export class ValidationRuleDto {
  @ApiProperty({ enum: ValidationRule })
  @IsEnum(ValidationRule)
  type!: ValidationRule

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  @IsEndorsementValidator()
  value: Record<string, unknown> | null = null
}
