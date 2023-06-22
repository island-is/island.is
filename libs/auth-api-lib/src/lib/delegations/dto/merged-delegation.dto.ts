import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'
import { DelegationType } from '../types/delegationType'
import { DelegationScopeDTO } from './delegation-scope.dto'

export class MergedDelegationDTO {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  fromName?: string

  @IsString()
  @ApiProperty()
  toNationalId!: string

  @IsString()
  @ApiPropertyOptional({ nullable: true, type: String })
  toName?: string | null

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ nullable: true, type: Date })
  validTo?: Date | null

  @ApiProperty({
    enum: DelegationType,
    enumName: 'DelegationType',
    isArray: true,
  })
  types!: DelegationType[]

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [DelegationScopeDTO], nullable: true })
  scopes?: DelegationScopeDTO[] | null
}
