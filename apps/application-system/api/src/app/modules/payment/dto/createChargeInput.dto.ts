import { IsString } from 'class-validator'

export class CreateChargeInput {
  @IsString()
  readonly chargeItemCode!: string
}
