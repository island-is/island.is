import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class VerificationCallbackInput {
  @IsString()
  // A signed token of a few hundred characters, anything longer is not ours
  @MaxLength(1024)
  @ApiProperty({
    description: 'Encoded MD object with custom request data.',
    type: String,
  })
  md!: string

  @IsString()
  @ApiProperty({
    description:
      'MD Status: Indicates the outcome of the 3D Secure authentication process.',
    type: String,
  })
  mdStatus!: string

  @IsString()
  @ApiProperty({
    description:
      'Cardholder authentication verificationProves cardholder authentication.',
    type: String,
  })
  cavv!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Request id. Not used for the charge and not sent by every EMV 3DS flow.',
    type: String,
  })
  xid?: string

  @IsString()
  @ApiProperty({
    description:
      'Universally unique transaction identifier assigned by the DS to identify a single transaction.',
    type: String,
  })
  dsTransId!: string

  @IsString()
  @IsOptional()
  @MaxLength(64)
  @ApiPropertyOptional({
    description:
      'EMV 3DS message version from the callback, required by the gateway in the charge.',
    type: String,
  })
  threeDSMessageVersion?: string
}
