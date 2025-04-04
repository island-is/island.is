import {
  TranslationService,
  TranslationDTO,
  Translation,
  LanguageDTO,
  Language,
  PagedRowsDto,
} from '@island.is/auth-api-lib'
import { NoContentException } from '@island.is/nest/problem'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'

const namespace = `@island.is/auth-admin-api/translation`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'translation', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class TranslationController {
  constructor(
    private readonly translationService: TranslationService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all translations and count of rows */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('translations')
  @ApiQuery({ name: 'searchString', required: false })
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(Translation) },
            },
          },
        },
      ],
    },
  })
  @Audit<PagedRowsDto<Translation>>({
    resources: (result) =>
      result.rows.map(
        (translation) =>
          `${translation.language}/${translation.className}/${translation.property}/${translation.key}`,
      ),
  })
  async findAndCountAllTranslations(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<Translation>> {
    if (searchString) {
      return this.translationService.findTranslations(searchString, page, count)
    }
    return this.translationService.findAndCountAllTranslations(page, count)
  }

  /** Get's and counts all languages */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('languages')
  @ApiQuery({ name: 'page', required: true })
  @ApiQuery({ name: 'count', required: true })
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            count: {
              type: 'number',
              example: 1,
            },
            rows: {
              type: 'array',
              items: { $ref: getSchemaPath(Translation) },
            },
          },
        },
      ],
    },
  })
  @Audit<PagedRowsDto<Language>>({
    resources: (result) => result.rows.map((language) => language.isoKey),
  })
  async findAndCountAllLanguages(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<PagedRowsDto<Language>> {
    return this.translationService.findAndCountAllLanguages(page, count)
  }

  /** Get's and counts all languages */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('all-languages')
  @ApiOkResponse({ type: [Language] })
  @Audit<Language[]>({
    resources: (languages) => languages.map((language) => language.isoKey),
  })
  async findAllLanguages(): Promise<Language[]> {
    return this.translationService.findAllLanguages()
  }

  /** Adds a new Language */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('language')
  @ApiCreatedResponse({ type: Language })
  @Audit<Language>({
    resources: (language) => language?.isoKey,
  })
  async createLanguage(@Body() language: LanguageDTO): Promise<Language> {
    return this.translationService.createLanguage(language)
  }

  /** Updates a an existing Language */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put('language')
  @ApiCreatedResponse({ type: Language })
  async updateLanguage(
    @Body() language: LanguageDTO,
    @CurrentUser() user: User,
  ): Promise<Language> {
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updateLanguage',
        namespace,
        resources: language.isoKey,
        meta: { fields: Object.keys(language) },
      },
      this.translationService.updateLanguage(language),
    )
  }

  /** Deletes a Language */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('language/:isoKey')
  @ApiCreatedResponse({ type: Language })
  async deleteLanguage(
    @Param('isoKey') isoKey: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'deleteLanguage',
        namespace,
        resources: isoKey,
      },
      this.translationService.deleteLanguage(isoKey),
    )
  }

  /** Deletes a Language */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('language/:isoKey')
  @ApiOkResponse({ type: Language })
  @Audit<Language>({
    resources: (language) => language?.isoKey,
  })
  async findLanguage(@Param('isoKey') isoKey: string): Promise<Language> {
    const language = await this.translationService.findLanguage(isoKey)
    if (!language) {
      throw new NoContentException()
    }
    return language
  }

  /** Adds a new translation */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('translation')
  @ApiCreatedResponse({ type: Translation })
  @Audit<Translation>({
    resources: (translation) =>
      translation
        ? `${translation.language}/${translation.className}/${translation.property}/${translation.key}`
        : '',
  })
  async createTranslation(
    @Body() translation: TranslationDTO,
  ): Promise<Translation> {
    return this.translationService.createTranslation(translation)
  }

  /** Gets translation by it's key */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('translation/:language/:className/:property/:key')
  @ApiOkResponse({ type: Translation })
  @Audit<Translation>({
    resources: (translation) =>
      translation
        ? `${translation.language}/${translation.className}/${translation.property}/${translation.key}`
        : '',
  })
  async findTranslation(
    @Param('language') language: string,
    @Param('className') className: string,
    @Param('property') property: string,
    @Param('key') key: string,
  ): Promise<Translation> {
    const translation = await this.translationService.findTranslation(
      language,
      className,
      property,
      key,
    )
    if (!translation) {
      throw new NoContentException()
    }
    return translation
  }

  /** Updates a translation */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Put('translation')
  @ApiCreatedResponse({ type: Translation })
  async updateTranslation(
    @Body() translation: TranslationDTO,
    @CurrentUser() user: User,
  ): Promise<Translation> {
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updateTranslation',
        namespace,
        resources: `${translation.language}/${translation.className}/${translation.property}/${translation.key}`,
      },
      this.translationService.updateTranslation(translation),
    )
  }

  /** Delete translation */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('translation')
  @ApiCreatedResponse({ type: Translation })
  async deleteTranslation(
    @Body() translation: TranslationDTO,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'deleteTranslation',
        namespace,
        resources: `${translation.language}/${translation.className}/${translation.property}/${translation.key}`,
      },
      this.translationService.deleteTranslation(translation),
    )
  }
}
