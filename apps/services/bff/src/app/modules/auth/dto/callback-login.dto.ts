import { IsOptional, IsString } from 'class-validator'

export class CallbackLoginDto {
  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsString()
  scope?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  session_state?: string

  // IDS responds with an error if the request is invalid
  // @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
  @IsOptional()
  @IsString()
  invalid_request?: string

  // IDS responds with error and error_description when authentication fails
  // @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
  @IsOptional()
  @IsString()
  error?: string

  @IsOptional()
  @IsString()
  error_description?: string
}
