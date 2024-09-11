import {
  Controller,
  Post,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { qsValidationPipe } from '../../utils/qs-validation-pipe'
import { ProxyService } from './proxy.service'
import { ApiQuery } from './queries/api-proxy.query'

@Controller({
  path: 'api',
  version: [VERSION_NEUTRAL, '1'],
})
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post()
  async proxyApiUrlRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: ApiQuery,
  ): Promise<void> {
    return this.proxyService.proxyApiUrlRequest({ req, res, query })
  }

  @Post('/graphql')
  async proxyGraphqlRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.proxyService.proxyRequest({ req, res })
  }
}
