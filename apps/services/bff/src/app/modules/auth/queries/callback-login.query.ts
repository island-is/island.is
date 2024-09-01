import { IsString } from 'class-validator'

export class CallbackLoginQuery {
  @IsString()
  code!: string

  @IsString()
  scope!: string

  @IsString()
  state!: string

  @IsString()
  session_state!: string
}
