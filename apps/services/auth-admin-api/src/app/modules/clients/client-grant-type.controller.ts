import {
  ClientsService,
  ClientGrantTypeDTO,
  ClientGrantType,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'

@ApiOAuth2(['@identityserver.api/read'])
// TODO: ADD guards when functional
// @UseGuards(AuthGuard('jwt'))
@ApiTags('client-grant-type')
@Controller('client-grant-type')
export class ClientGrantTypeController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Adds new Grant type to client */
  @Post()
  @ApiCreatedResponse({ type: ClientGrantType })
  async create(
    @Body() grantType: ClientGrantTypeDTO,
  ): Promise<ClientGrantType> {
    return await this.clientsService.addGrantType(grantType)
  }

  /** Removes a grant type from client */
  @Delete(':clientId/:grantType')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('grantType') grantType: string,
  ): Promise<number> {
    if (!clientId || !grantType) {
      throw new BadRequestException('clientId and grantType must be provided')
    }

    return await this.clientsService.removeGrantType(clientId, grantType)
  }
}
