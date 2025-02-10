import { IsOptional, IsString } from 'class-validator'

export class LoginDto {
  @IsOptional()
  @IsString()
  target_link_uri?: string

  @IsOptional()
  @IsString()
  login_hint?: string

  @IsOptional()
  @IsString()
  prompt?: string
}
