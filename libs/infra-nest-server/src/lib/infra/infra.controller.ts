import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Liveness } from './entities/liveness.entity'
import { Version } from './entities/version.entity'

@Controller()
@ApiTags('internal')
export class InfraController {
  @Get('liveness')
  @ApiOkResponse({ type: Liveness })
  liveness(): Liveness {
    return { ok: true }
  }

  @Get('version')
  @ApiOkResponse({ type: Version })
  version(): Version {
    return { version: process.env.REVISION || 'N/A' }
  }
}
