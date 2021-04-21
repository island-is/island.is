import {
  TranslationService,
  TranslationDTO,
  Translation,
  LanguageDTO,
  Language,
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
import { IdsUserGuard, ScopesGuard, Scopes } from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('translation')
@Controller('backend/translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

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
  async findAndCountAllTranslations(
    @Query('searchString') searchString: string,
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: Translation[]; count: number } | null> {
    if (searchString) {
      const translations = await this.translationService.findTranslations(
        searchString,
        page,
        count,
      )
      return translations
    }
    const translations = await this.translationService.findAndCountAllTranslations(
      page,
      count,
    )
    return translations
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
  async findAndCountAllLanguages(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<{ rows: Language[]; count: number } | null> {
    const languages = await this.translationService.findAndCountAllLanguages(
      page,
      count,
    )
    return languages
  }

  /** Get's and counts all languages */
  @Scopes(Scope.root, Scope.full)
  @Get('all-languages')
  @ApiOkResponse({ type: [Language] })
  async findAllLanguages(): Promise<Language[] | null> {
    const languages = await this.translationService.findAllLanguages()
    return languages
  }

  /** Adds a new Language */
  @Scopes(Scope.root, Scope.full)
  @Post('language')
  @ApiCreatedResponse({ type: Language })
  async createLanguage(
    @Body() language: LanguageDTO,
  ): Promise<Language | null> {
    return await this.translationService.createLanguage(language)
  }

  /** Updates a an existing Language */
  @Scopes(Scope.root, Scope.full)
  @Put('language')
  @ApiCreatedResponse({ type: Language })
  async updateLanguage(
    @Body() language: LanguageDTO,
  ): Promise<Language | null> {
    return await this.translationService.updateLanguage(language)
  }

  /** Deletes a Language */
  @Scopes(Scope.root, Scope.full)
  @Delete('language/:isoKey')
  @ApiCreatedResponse({ type: Language })
  async deleteLanguage(
    @Param('isoKey') isoKey: string,
  ): Promise<number | null> {
    return await this.translationService.deleteLanguage(isoKey)
  }

  /** Deletes a Language */
  @Scopes(Scope.root, Scope.full)
  @Get('language/:isoKey')
  @ApiOkResponse({ type: Language })
  async findLanguage(
    @Param('isoKey') isoKey: string,
  ): Promise<Language | null> {
    return await this.translationService.findLanguage(isoKey)
  }

  /** Adds a new translation */
  @Scopes(Scope.root, Scope.full)
  @Post('translation')
  @ApiCreatedResponse({ type: Translation })
  async createTranslation(
    @Body() translation: TranslationDTO,
  ): Promise<Translation | null> {
    return await this.translationService.createTranslation(translation)
  }

  /** Gets translation by it's key */
  @Scopes(Scope.root, Scope.full)
  @Get('translation/:language/:className/:property/:key')
  @ApiOkResponse({ type: Translation })
  async findTranslation(
    @Param('language') language: string,
    @Param('className') className: string,
    @Param('property') property: string,
    @Param('key') key: string,
  ): Promise<Translation | null> {
    return await this.translationService.findTranslation(
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
  ): Promise<Translation | null> {
    return await this.translationService.updateTranslation(translation)
  }

  /** Delete translation */
  @Scopes(Scope.root, Scope.full)
  @Delete('translation')
  @ApiCreatedResponse({ type: Translation })
  async deleteTranslation(
    @Body() translation: TranslationDTO,
  ): Promise<number | null> {
    return await this.translationService.deleteTranslation(translation)
  }
}
