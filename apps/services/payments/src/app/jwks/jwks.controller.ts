import { Controller, Get } from '@nestjs/common'

import { KeyRegistryService } from './key-registry.service'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ServeJwksResponseDto } from './dtos/serveJwks.response'
@ApiTags('payments')
@Controller('.well-known')
export class JwksController {
  constructor(private readonly registry: KeyRegistryService) {}

  @Get('jwks.json')
  @ApiOkResponse({
    type: ServeJwksResponseDto,
  })
  async serveJwks(): Promise<ServeJwksResponseDto> {
    return this.registry.getJwks()
  }
}
