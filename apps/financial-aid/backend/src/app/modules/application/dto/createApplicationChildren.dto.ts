import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateApplicationChildrenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicationId: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly school?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly nationalId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string
}
