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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

@UseGuards(IdsUserGuard, NationalIdGuard)
@ApiTags('client-secret')
@Controller('backend/client-secret')
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
