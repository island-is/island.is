import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty,IsString } from 'class-validator'

export class ApiScopeGroupDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Finance',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Finance Heading',
  })
  readonly displayName!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description about the Finance Group',
  })
  readonly description!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@island.is',
  })
  readonly domainName!: string
}
