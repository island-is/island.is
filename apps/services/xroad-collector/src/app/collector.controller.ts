import { Controller, Get } from '@nestjs/common'
import { RestServiceCollector } from './restservicecollector.service'

@Controller('collector')
export class CollectorController {
  constructor(private readonly restServiceCollector: RestServiceCollector) {}

  @Get('index/rest')
  async indexRestServices(): Promise<boolean> {
    await this.restServiceCollector.indexServices()

    return true
  }
}
