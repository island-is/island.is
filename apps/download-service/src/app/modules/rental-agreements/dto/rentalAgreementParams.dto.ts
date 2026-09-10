import { IsNotEmpty, IsString } from 'class-validator'

export class RentalAgreementParamsDto {
  @IsString()
  @IsNotEmpty()
  contractId!: string
}
