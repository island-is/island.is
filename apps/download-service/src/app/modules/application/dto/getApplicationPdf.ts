import { IsString, IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetApplicationPdfDto {
  @IsString()
  @ApiProperty()
  readonly applicationId!: string

  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
