import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AdminAccessUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'auth-admin-api.full_control',
  })
  scope!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'something@gmail.com',
  })
  email!: string

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  active!: boolean
}
