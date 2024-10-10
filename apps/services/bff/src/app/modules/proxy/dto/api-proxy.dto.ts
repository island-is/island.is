import { IsString } from 'class-validator'

export class ApiProxyDto {
  @IsString()
  url!: string
}
