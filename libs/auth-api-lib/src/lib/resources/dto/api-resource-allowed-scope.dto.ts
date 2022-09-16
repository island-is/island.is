import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class ApiResourceAllowedScopeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'apiResourceName',
  })
  apiResourceName!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'scopeName',
  })
  scopeName!: string
}
