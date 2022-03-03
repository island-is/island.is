import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
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
