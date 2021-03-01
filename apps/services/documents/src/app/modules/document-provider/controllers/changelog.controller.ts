import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { DocumentProviderService } from '../document-provider.service'
import { Changelog } from '../models/changelog.model'

@ApiTags('changelogs')
@Controller('changelogs')
export class ChangelogController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [Changelog] })
  async getAllChangelogs(): Promise<Changelog[] | null> {
    return await this.documentProviderService.getChangelogs()
  }
}
