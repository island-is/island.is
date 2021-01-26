import { IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly id!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly organisationId!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  endpoint?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  endpointType?: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  apiScope?: string
}
