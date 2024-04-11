import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator'
import { AuthDelegationType } from '@island.is/shared/types'
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
    enum: AuthDelegationType,
    enumName: 'AuthDelegationType',
    isArray: true,
  })
  types!: AuthDelegationType[]

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [DelegationScopeDTO], nullable: true })
  scopes?: DelegationScopeDTO[] | null
}
