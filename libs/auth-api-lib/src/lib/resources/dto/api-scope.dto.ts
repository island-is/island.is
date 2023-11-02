import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

import { ApiScopeBaseDTO } from './base/api-scope-base.dto'

export class ApiScopeDTO extends ApiScopeBaseDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'set_display_name',
  })
  readonly displayName!: string

  @IsString()
  @ApiProperty({
    example: 'set_description',
  })
  readonly description!: string
}
