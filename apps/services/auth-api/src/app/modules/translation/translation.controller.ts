import { TranslationService, Translation } from '@island.is/auth-api-lib'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { trace } from '@gamechanger/datadog-apm'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('translation')
@Controller('translations')
@trace()
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
