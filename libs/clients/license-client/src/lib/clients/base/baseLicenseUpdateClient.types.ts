import { IsString } from 'class-validator'

export class VerifyInputDataDto {
  @IsString()
  code!: string

  @IsString()
  date!: string
}
