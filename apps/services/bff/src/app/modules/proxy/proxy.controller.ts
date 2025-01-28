import {
  Body,
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
import { ApiProxyDto } from './dto/api-proxy.dto'
import { ProxyService } from './proxy.service'

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

  @Post()
  async forwardPostApiRequest(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: ApiProxyDto,
    @Body() body: Record<string, unknown>,
  ): Promise<void> {
    return this.proxyService.forwardPostApiRequest({ req, res, query, body })
  }

  @Post('/graphql')
  async proxyGraphqlRequest(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.proxyService.proxyGraphQLRequest({ req, res })
  }
}
