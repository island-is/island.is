import { IsString } from 'class-validator'

export class LogoutQuery {
  @IsString()
  sid!: string
}
