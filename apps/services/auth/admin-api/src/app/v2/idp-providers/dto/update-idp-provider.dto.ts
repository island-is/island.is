import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateIdpProviderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description about the provider',
  })
  readonly description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Help text that guides the user about this provider',
  })
  readonly helptext!: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
  })
  readonly level!: number
}
