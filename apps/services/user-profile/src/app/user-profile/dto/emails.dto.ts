import { ApiProperty } from '@nestjs/swagger'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class EmailsDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: String, nullable: true })
  email!: string | null

  @ApiProperty()
  primary!: boolean

  @ApiProperty()
  emailStatus!: DataStatus

  @ApiProperty()
  isConnectedToActorProfile!: boolean
}
