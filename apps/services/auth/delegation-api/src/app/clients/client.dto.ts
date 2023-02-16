import { ApiProperty } from '@nestjs/swagger'

export class ClientDto {
  @ApiProperty({
    example: '@island.is/web',
    description: 'This is the client id that is used to identify the client.',
  })
  clientId!: string

  @ApiProperty({
    example: 'Mínar síður Ísland.is',
    description:
      'This is the name of the client that is displayed to the user.',
  })
  clientName!: string

  @ApiProperty({
    example: '@island.is/web',
    description:
      'This is the domain name, unique identifier for the domain the client belongs to.',
  })
  domainName!: string
}
