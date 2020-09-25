import { Controller, Get, Param } from '@nestjs/common'
import { XroadClientService } from './xroadclient.service'

@Controller('clients')
export class XroadClientController {
  constructor(private readonly xrdClientService: XroadClientService) {}

  @Get()
  async getClients() {
    return this.xrdClientService.getData()
  }

  @Get(':clientId/services')
  async getServices(@Param() params) {
    return this.xrdClientService.getServices()
  }

  @Get(':clientId/services/:serviceId')
  async getService(@Param() params): Promise<string> {
    console.log(
      `Getting service ${params.serviceId} from client ${params.clientId}`,
    )
    return this.xrdClientService.getService(params.serviceId)
  }
}
