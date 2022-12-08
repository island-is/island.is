import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiScopeUserAccessDTO } from './api-scope-user-access.dto'

export class ApiScopeUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0123456789',
  })
  nationalId!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'something@gmail.com',
  })
  email!: string

  @IsNotEmpty()
  @ApiProperty({
    example: [{ nationalId: '0123456789', scope: 'scope_name' }],
  })
  userAccess?: ApiScopeUserAccessDTO[]
}
