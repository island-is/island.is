import { IsOptional, IsString } from 'class-validator'

export class LoginQueryDto {
  @IsOptional()
  @IsString()
  target_link_uri?: string

  @IsOptional()
  @IsString()
  login_hint?: string
}
