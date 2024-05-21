import { ApiProperty } from '@nestjs/swagger'

import { IsString } from 'class-validator'

// TODO remove before merging into main
// should only be possible to verify authentication through auth-ids-api
export class AuthenticationResponse {
  @IsString()
  @ApiProperty()
  passkey!: string
}
