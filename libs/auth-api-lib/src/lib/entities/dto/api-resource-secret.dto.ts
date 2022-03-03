import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
export class ApiResourceSecretDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'apiResourceName',
  })
  apiResourceName!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'secret string',
  })
  value!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'descroðtopm',
  })
  description?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'SharedSecret',
  })
  type!: string
}
