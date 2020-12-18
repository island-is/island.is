import { IsString, IsBoolean, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResourceUserClaims {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sub',
  })
  readonly claimName!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
  })
  readonly implemented!: boolean

  @IsString()
  @ApiProperty({
    example: 'Lorem ipsum',
  })
  readonly claim_description!: string
}
