import { IsString } from 'class-validator'

export class CallbackLogoutQuery {
  @IsString()
  sid!: string
}
