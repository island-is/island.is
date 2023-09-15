import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ApiScopeUserAccessDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0123456789',
  })
  nationalId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'auth-admin-api.full_control',
  })
  scope!: string
}
