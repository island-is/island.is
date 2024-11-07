import { IsOptional, IsString } from 'class-validator'

export class CallbackLogoutDto {
  @IsOptional()
  @IsString()
  logout_token?: string
}
