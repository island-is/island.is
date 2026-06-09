import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class UpdateScopeClientsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description:
      'Client ids to grant access to the scope. Clients may belong to any tenant; the authorization check is against the scope owner only.',
  })
  addedClientIds!: string[]

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Client ids to revoke access from the scope.',
  })
  removedClientIds!: string[]
}
