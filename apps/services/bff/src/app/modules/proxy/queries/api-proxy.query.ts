import { IsString } from 'class-validator'

export class ApiQuery {
  @IsString()
  url!: string
}
