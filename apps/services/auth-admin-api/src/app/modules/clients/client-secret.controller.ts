import {
  ClientsService,
  ClientSecretDTO,
  ClientSecret,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
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

  /** Removes a secret from client */
  @Delete()
  @ApiCreatedResponse()
  async delete(@Body() clientSecret: ClientSecretDTO): Promise<number> {
    if (!clientSecret) {
      throw new BadRequestException('The Client Secret object is required')
    }

    return await this.clientsService.removeClientSecret(clientSecret)
  }
}
