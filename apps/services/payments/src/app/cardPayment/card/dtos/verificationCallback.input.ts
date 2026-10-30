import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class VerificationCallbackInput {
  @IsString()
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
  @ApiProperty({
    description: 'Request id',
    type: String,
  })
  xid!: string

  @IsString()
  @ApiProperty({
    description:
      'Universally unique transaction identifier assigned by the DS to identify a single transaction.',
    type: String,
  })
  dsTransId!: string
}
