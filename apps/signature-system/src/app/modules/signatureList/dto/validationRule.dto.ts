import { IsEnum, IsOptional, IsString } from 'class-validator'

// TODO: Move these to validation module
export enum ValidationRule {
  MIN_AGE_AT_DATE = 'minAgeAtDate',
}

export class ValidationRuleDto {
  @IsEnum(ValidationRule)
  type!: ValidationRule

  @IsOptional()
  @IsString()
  value?: string
}
