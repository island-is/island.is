import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { PublicUser } from '@island.is/clients/islykill'

export class IslayklarUpsertDto {
  @ApiProperty()
  nationalId: string

  @ApiPropertyOptional()
  email?: string

  @ApiPropertyOptional()
  phoneNumber?: string

  @ApiPropertyOptional()
  publicUser?: PublicUser
}
