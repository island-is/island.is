import { Controller, Get } from '@nestjs/common'

import { KeyRegistryService } from './key-registry.service'

@Controller('.well-known')
export class JwksController {
  constructor(private readonly registry: KeyRegistryService) {}

  @Get('jwks.json')
  async serveJwks() {
    return this.registry.getJwks()
  }
}
