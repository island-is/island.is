import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { ApiScopeUserAccessDTO } from './api-scope-user-access.dto'

export class ApiScopeUserUpdateDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Jane Doe',
    required: false,
  })
  name?: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'something@gmail.com',
    required: false,
  })
  email?: string

  @IsOptional()
  @ApiProperty({
    type: [ApiScopeUserAccessDTO],
    example: [{ nationalId: '0123456789', scope: 'scope_name' }],
    required: false,
  })
  userAccess?: ApiScopeUserAccessDTO[]
}
