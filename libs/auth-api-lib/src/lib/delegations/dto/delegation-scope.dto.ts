import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateDelegationScopeDTO {
  @IsString()
  @ApiProperty()
  name!: string

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description:
      'A date that the delegation is valid to. Must be in the future.',
  })
  validTo!: Date
}

export class DelegationScopeDTO {
  @ApiPropertyOptional({ nullable: true, type: String })
  id?: string | null

  @IsString()
  @ApiProperty()
  delegationId!: string

  @IsString()
  @ApiProperty()
  scopeName!: string

  @IsString()
  @ApiProperty()
  displayName!: string

  @IsDateString()
  @ApiProperty()
  validFrom!: Date

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null
}
