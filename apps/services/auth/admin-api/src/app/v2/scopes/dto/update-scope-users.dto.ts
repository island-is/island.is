import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class UpdateScopeUsersDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'National IDs of users to grant access to the scope',
  })
  addedNationalIds!: string[]

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'National IDs of users to revoke access from the scope',
  })
  removedNationalIds!: string[]
}
