import { ApiProperty } from '@nestjs/swagger'

export class ClientDto {
  @ApiProperty({
    example: '@island.is/web',
    description: 'This is the client id that is used to identify the client.',
  })
  id!: string

  @ApiProperty({
    example: 'Mínar síður Ísland.is',
    description:
      'This is the name of the client that is displayed to the user.',
  })
  name!: string

  @ApiProperty({
    example: 'Stafrænt Ísland',
    description: 'This key is used to look up the organisation in Contentful.',
  })
  organisationLogoKey?: string
}
