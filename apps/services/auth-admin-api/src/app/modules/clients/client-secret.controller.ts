import {
  ClientsService,
  ClientSecretDTO,
  ClientSecret,
} from '@island.is/auth-api-lib'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// TODO: ADD guards when functional
// @UseGuards(AuthGuard('jwt'))
@ApiTags('client-secret')
@Controller('client-secret')
export class ClientSecretController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new secret to client */
  @Post()
  @ApiCreatedResponse({ type: ClientSecret })
  async create(@Body() clientSecret: ClientSecretDTO): Promise<ClientSecret> {
    if (!clientSecret) {
      throw new BadRequestException('Client Secret object is required')
    }

    return await this.clientsService.addClientSecret(clientSecret)
  }
}
