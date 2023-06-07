import { IsNationalId } from '@island.is/nest/core'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsJSON,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

export class VerifyLicenseRequest {
  @ApiProperty({ description: 'PDF417 barcode scanner data' })
  @IsJSON()
  //Dont really need to verify, the proper service destination shall do that. Just need to check which type to know where to send
  readonly barcodeData!: string
  @IsOptional()
  @ApiProperty({ description: 'Optional request id for logging purposes' })
  @IsString()
  readonly requestId?: string
}

class PassIdentity {
  @ApiProperty({ description: "The scanned user's name" })
  @IsString()
  readonly name!: string
  @ApiProperty({ description: "The scanned user's national id" })
  @IsNationalId()
  readonly nationalId!: string
  @ApiPropertyOptional({ description: 'Picture of scanned user' })
  @IsOptional()
  @IsString()
  readonly picture?: string
}

export class VerifyLicenseResponse {
  @ApiProperty({ description: 'Is the license verified?' })
  @IsBoolean()
  readonly valid!: boolean
  @ApiPropertyOptional({ description: 'Verification identity data' })
  @IsOptional()
  @IsObject()
  readonly passIdentity?: PassIdentity
}
