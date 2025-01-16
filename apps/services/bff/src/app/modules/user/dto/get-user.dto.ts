import { IsOptional, IsString } from 'class-validator'

export class GetUserDto {
  @IsOptional()
  @IsString()
  refresh?: string
}
