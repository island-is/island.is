import { IsString, IsNotEmpty } from 'class-validator'
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
    example: 'Description about the Finance Group',
  })
  readonly description!: string
}
