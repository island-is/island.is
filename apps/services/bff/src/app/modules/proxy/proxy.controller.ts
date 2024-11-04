import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { qsValidationPipe } from '../../utils/qs-validation-pipe'
import { ProxyService } from './proxy.service'
import { ApiProxyDto } from './dto/api-proxy.dto'

@Controller({
  path: 'api',
  version: [VERSION_NEUTRAL, '1'],
})
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Get()
  async forwardGetApiRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: ApiProxyDto,
  ): Promise<void> {
    return this.proxyService.forwardGetApiRequest({ req, res, query })
  }

  @Post('/graphql')
  async proxyGraphqlRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.proxyService.proxyGraphQLRequest({ req, res })
  }
}
