import { ArrayNotEmpty, IsArray, IsString } from 'class-validator'

export class CreateChargeInput {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly chargeItemCodes!: string[]
}
