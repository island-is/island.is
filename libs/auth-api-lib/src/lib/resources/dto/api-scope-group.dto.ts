import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

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

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 0,
    default: 0,
  })
  readonly order?: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@island.is',
  })
  readonly domainName!: string
}
