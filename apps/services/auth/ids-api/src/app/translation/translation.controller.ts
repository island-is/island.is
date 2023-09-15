import { TranslationService, Translation } from '@island.is/auth-api-lib'
import { Controller, Get, UseGuards, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('translation')
@Controller({
  path: 'translations',
  version: ['1', VERSION_NEUTRAL],
})
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  /** Gets translations  */
  @Scopes('@identityserver.api/authentication')
  @Get()
  @ApiOkResponse({ type: [Translation] })
  async findAllTranslations(): Promise<Translation[] | null> {
    return await this.translationService.findAllTranslations()
  }
}
