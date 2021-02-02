import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProviderDto {
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
