import { IsOptional, IsString } from 'class-validator'

export class GetUserQuery {
  @IsOptional()
  @IsString()
  no_refresh?: string
}
