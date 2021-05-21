import {
  TranslationService,
  TranslationDTO,
  Translation,
  LanguageDTO,
  Language,
  PagedRowsDto,
} from '@island.is/auth-api-lib'
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
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/environment'

const namespace = `${environment.audit.defaultNamespace}/translation`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('translation')
@Controller('backend/translation')
@Audit({ namespace })
export class TranslationController {
  constructor(
    private readonly translationService: TranslationService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all translations and count of rows */
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
  @Get('all-languages')
  @ApiOkResponse({ type: [Language] })
  @Audit<Language[]>({
    resources: (languages) => languages.map((language) => language.isoKey),
  })
  async findAllLanguages(): Promise<Language[]> {
    return this.translationService.findAllLanguages()
  }

  /** Adds a new Language */
  @Scopes(Scope.root, Scope.full)
  @Post('language')
  @ApiCreatedResponse({ type: Language })
  @Audit<Language>({
    resources: (language) => language?.isoKey,
  })
  async createLanguage(@Body() language: LanguageDTO): Promise<Language> {
    return this.translationService.createLanguage(language)
  }

  /** Updates a an existing Language */
  @Scopes(Scope.root, Scope.full)
  @Put('language')
  @ApiCreatedResponse({ type: Language })
  async updateLanguage(
    @Body() language: LanguageDTO,
    @CurrentUser() user: User,
  ): Promise<Language> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'updateLanguage',
        namespace,
        resources: language.isoKey,
        meta: { fields: Object.keys(language) },
      },
      this.translationService.updateLanguage(language),
    )
  }

  /** Deletes a Language */
  @Scopes(Scope.root, Scope.full)
  @Delete('language/:isoKey')
  @ApiCreatedResponse({ type: Language })
  async deleteLanguage(
    @Param('isoKey') isoKey: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteLanguage',
        namespace,
        resources: isoKey,
      },
      this.translationService.deleteLanguage(isoKey),
    )
  }

  /** Deletes a Language */
  @Scopes(Scope.root, Scope.full)
  @Get('language/:isoKey')
  @ApiOkResponse({ type: Language })
  @Audit<Language>({
    resources: (language) => language?.isoKey,
  })
  async findLanguage(@Param('isoKey') isoKey: string): Promise<Language> {
    return this.translationService.findLanguage(isoKey)
  }

  /** Adds a new translation */
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
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
    return this.translationService.findTranslation(
      language,
      className,
      property,
      key,
    )
  }

  /** Updates a translation */
  @Scopes(Scope.root, Scope.full)
  @Put('translation')
  @ApiCreatedResponse({ type: Translation })
  async updateTranslation(
    @Body() translation: TranslationDTO,
    @CurrentUser() user: User,
  ): Promise<Translation> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'udpateTranslation',
        namespace,
        resources: `${translation.language}/${translation.className}/${translation.property}/${translation.key}`,
      },
      this.translationService.updateTranslation(translation),
    )
  }

  /** Delete translation */
  @Scopes(Scope.root, Scope.full)
  @Delete('translation')
  @ApiCreatedResponse({ type: Translation })
  async deleteTranslation(
    @Body() translation: TranslationDTO,
    @CurrentUser() user: User,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteTranslation',
        namespace,
        resources: `${translation.language}/${translation.className}/${translation.property}/${translation.key}`,
      },
      this.translationService.deleteTranslation(translation),
    )
  }
}
