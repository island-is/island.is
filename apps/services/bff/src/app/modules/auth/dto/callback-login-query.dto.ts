import { IsString } from 'class-validator'

export class CallbackLoginQueryDto {
  @IsString()
  code!: string

  @IsString()
  scope!: string

  @IsString()
  state!: string

  @IsString()
  session_state!: string
}
