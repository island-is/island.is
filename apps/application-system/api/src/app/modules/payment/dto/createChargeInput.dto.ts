import { IsString, IsObject } from 'class-validator'

export class CreateChargeInput {
  @IsString()
  readonly chargeItemCode!: string
}
