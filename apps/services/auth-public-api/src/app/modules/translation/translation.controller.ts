import { TranslationService, Translation } from '@island.is/auth-api-lib'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('translation')
@Controller('v1/translations')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  /** Gets translations  */
  @Scopes('@island.is/auth/delegations:read')
  @Get()
  @ApiOkResponse({ type: [Translation] })
  async findAllTranslations(): Promise<Translation[] | null> {
    return await this.translationService.findAllTranslations()
  }
}
