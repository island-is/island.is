// import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class RegistrationOptions {
  @IsString()
  data: string

  @IsOptional()
  @IsString()
  appAttest?: string

  @IsOptional()
  @IsString()
  playIntegrity?: string
}
