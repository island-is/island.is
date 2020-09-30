import { ApiProperty } from '@nestjs/swagger'

export enum UserRole {
  PROSECUTOR = 'PROSECUTOR',
  JUDGE = 'JUDGE',
}

export class User {
  @ApiProperty()
  nationalId: string

  @ApiProperty()
  name: string

  @ApiProperty()
  roles: UserRole[]
}
