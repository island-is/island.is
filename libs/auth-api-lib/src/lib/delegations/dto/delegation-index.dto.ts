import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DelegationIndexDto {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsString()
  @ApiProperty()
  providerId!: string

  @IsString()
  @ApiProperty()
  type!: string

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'All scopes that a custom delegation has',
  })
  customDelegationScopes?: string[] | null

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}
