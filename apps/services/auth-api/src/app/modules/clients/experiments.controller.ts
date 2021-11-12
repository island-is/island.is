import { Client, ClientsService } from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { fakeClient } from './fakes'

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// @UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('clients')
@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly clientsService: ClientsService) {}

  /** Gets a client by id */
  // @Scopes('@identityserver.api/authentication')
  @Get('json-response')
  @ApiOkResponse({ type: Client })
  async jsonResponse(): Promise<Partial<Client>> {
    return fakeClient
  }
  @Get('wait-json-response')
  @ApiOkResponse({ type: Client })
  async waitJsonResponse(): Promise<Partial<Client>> {
    await sleep(parseInt(process.env['FAKE_WAIT_MS'] ?? '100'))
    return fakeClient
  }
  @Get('big-json-response')
  @ApiOkResponse({ type: Client })
  async bigJsonResponse(): Promise<unknown> {
    return [
      ...Array(parseInt(process.env['FAKE_SIZE_NUMBER'] ?? '100')).keys(),
    ].reduce(
      (acc, item) => ({ ...acc, [`item-${item}`]: `value - ${item}` }),
      {} as { [name: string]: string },
    )
  }
}
