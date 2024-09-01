import { IsOptional, IsString } from 'class-validator'

export class LoginQuery {
  @IsOptional()
  @IsString()
  target_link_uri?: string

  @IsOptional()
  @IsString()
  login_hint?: string
}
