import { Controller, Post, Req, Res, VERSION_NEUTRAL } from '@nestjs/common'
import { Request, Response } from 'express'
import { ProxyService } from './proxy.service'

@Controller({
  path: 'api/graphql',
  version: [VERSION_NEUTRAL, '1'],
})
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post()
  async proxyRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.proxyService.proxyRequest({ req, res })
  }
}
