import { ApiProperty } from '@nestjs/swagger'

export class JwkDto {
  @ApiProperty({
    description: 'Key type',
    example: 'RSA',
  })
  kty!: string

  @ApiProperty({
    description: 'Modulus (base64 encoded)',
  })
  n!: string

  @ApiProperty({
    description: 'Exponent (base64 encoded)',
    example: 'AQAB',
  })
  e!: string

  @ApiProperty({
    description: 'Key ID',
    example: 'payments_key_n',
  })
  kid!: string

  @ApiProperty({
    description: 'Public key use (e.g., "sig" for signature)',
    example: 'sig',
  })
  use!: string

  @ApiProperty({
    description: 'Algorithm',
    example: 'RS256',
  })
  alg!: string
}

export class ServeJwksResponseDto {
  @ApiProperty({
    description: 'Array of JSON Web Keys',
    type: [JwkDto],
  })
  keys!: JwkDto[]
}
