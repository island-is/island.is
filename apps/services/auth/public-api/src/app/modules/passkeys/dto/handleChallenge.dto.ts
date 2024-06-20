import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export enum PasskeyAction {
  CREATE = 'webauthn.create',
  GET = 'webauthn.get',
  APPATTEST_CREATE = 'appattest.create',
}

export class HandleChallengeDTO {
  @IsEnum(PasskeyAction)
  type!: PasskeyAction
}
