import { IsString } from 'class-validator'

export class CallbackLogoutQuery {
  @IsString()
  state!: string
}
