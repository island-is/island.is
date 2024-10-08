import { IsString } from 'class-validator'

export class ApiDto {
  @IsString()
  url!: string
}
