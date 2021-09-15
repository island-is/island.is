import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { GetSignedUrl } from '@island.is/financial-aid/shared/lib'

export class GetSignedUrlDto implements GetSignedUrl {
  @IsString()
  @ApiProperty()
  readonly fileName: string
}
