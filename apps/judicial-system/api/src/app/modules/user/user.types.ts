import { ApiProperty } from '@nestjs/swagger'

export enum UserRole {
  PROCECUTOR = 'PROCECUTOR',
  JUDGE = 'JUDGE',
}

export class User {
  @ApiProperty()
  nationalId: string

  @ApiProperty()
  roles: UserRole[]
}
