import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class IdpProviderDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'provider_name',
  })
  name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description about the provider',
  })
  description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Help text that guides the user about this provider',
  })
  helptext!: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
  })
  level!: number
}
