import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsJSON } from 'class-validator'

export class VerifyLicenseRequest {
  @ApiProperty({ description: 'PDF417 barcode scanner data' })
  @IsJSON()
  //Dont really need to verify, the proper service destination shall do that. Just need to check which type to know where to send
  readonly barcodeData!: string
}

export class VerifyLicenseResponse {
  @ApiProperty({ description: 'Is the license verified?' })
  @IsBoolean()
  readonly valid!: boolean
}
