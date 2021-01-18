import {
  Client,
  ClientDTO,
  ClientsService,
  ClientUpdateDTO,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { IdsAuthGuard } from '@island.is/auth-nest-tools'
import { NationalIdGuard } from '../access/national-id-guard'

// This controller is added to test one function with the string 'backend' appended to it on the development environment
// If succesful, we know what the error is
// After the test, this controller should be deleted and removed from client.module

// @ApiOAuth2(['@identityserver.api/read'])
@UseGuards(IdsAuthGuard, NationalIdGuard)
@ApiTags('clients')
@Controller('backend/clients')
export class DevTestController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets all clients and count of rows */
  @Get()
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(Client) },
            },
          },
        },
      ],
    },
  })
  async findAndCountAll(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: Client[]; count: number } | null> {
    const clients = await this.clientsService.findAndCountAll(page, count)
    return clients
  }
}
