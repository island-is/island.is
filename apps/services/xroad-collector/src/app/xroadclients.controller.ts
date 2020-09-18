import { Controller, Get } from '@nestjs/common'
import { MetaservicesApi } from '../../gen/fetch-xrd'

@Controller('clients')
export class ClientsController {
  constructor(private readonly xrdMetaService: MetaservicesApi) {}

  @Get()
  getClients() {
    return this.xrdMetaService.listClients({})
  }
}
