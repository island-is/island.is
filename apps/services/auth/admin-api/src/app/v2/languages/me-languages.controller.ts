import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  Language,
  LanguageDTO,
  PagedRowsDto,
  TranslationService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import { NoContentException } from '@island.is/nest/problem'

import { PagedLanguagesDto } from './dto/paged-languages.dto'
import { UpdateLanguageDto } from './dto/update-language.dto'
import { DeleteLanguageDto } from './dto/delete-language.dto'

const namespace = '@island.is/auth/admin-api/v2/languages'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/languages',
  version: ['2'],
})
@Audit({ namespace })
export class MeLanguagesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly translationService: TranslationService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get a paginated list of languages.',
    response: { status: 200, type: PagedLanguagesDto },
    request: {
      query: {
        searchString: {
          required: false,
          type: 'string',
          description: 'Search by isoKey, description or englishDescription',
        },
        page: { required: true, type: 'number' },
        count: { required: true, type: 'number' },
      },
    },
  })
  @Audit<PagedRowsDto<Language>>({
    resources: (result) => result.rows.map((language) => language.isoKey),
  })
  findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<PagedRowsDto<Language>> {
    if (page < 1 || count < 1) {
      throw new BadRequestException('page and count must be positive integers')
    }

    return this.translationService.searchLanguages(searchString, page, count)
  }

  @Get('all')
  @Documentation({
    description: 'Get all languages without pagination.',
    response: { status: 200, type: [Language] },
  })
  @Audit<Language[]>({
    resources: (languages) => languages.map((language) => language.isoKey),
  })
  findAll(): Promise<Language[]> {
    return this.translationService.findAllLanguages()
  }

  @Get(':isoKey')
  @Documentation({
    description: 'Get a language by ISO key.',
    response: { status: 200, type: Language },
    includeNoContentResponse: true,
  })
  @Audit<Language>({
    resources: (language) => language?.isoKey,
  })
  async findOne(@Param('isoKey') isoKey: string): Promise<Language> {
    const language = await this.translationService.findLanguage(isoKey)
    if (!language) {
      throw new NoContentException()
    }
    return language
  }

  @Post()
  @Documentation({
    description: 'Create a new language.',
    response: { status: 201, type: Language },
  })
  @Audit<Language>({
    resources: (language) => language.isoKey,
    alsoLog: true,
  })
  create(@Body() input: LanguageDTO): Promise<Language> {
    return this.translationService.createLanguage(input)
  }

  @Patch(':isoKey')
  @Documentation({
    description: 'Update an existing language.',
    response: { status: 200, type: Language },
  })
  update(
    @CurrentUser() user: User,
    @Param('isoKey') isoKey: string,
    @Body() input: UpdateLanguageDto,
  ): Promise<Language> {
    return this.auditService.auditPromise<Language>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: isoKey,
        alsoLog: true,
        meta: { fields: ['description', 'englishDescription'] },
      },
      this.translationService.updateLanguage({
        isoKey,
        description: input.description,
        englishDescription: input.englishDescription,
      }),
    )
  }

  @Delete(':isoKey')
  @HttpCode(204)
  @Documentation({
    description: 'Delete a language.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('isoKey') isoKey: string,
    @Body() input: DeleteLanguageDto,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'delete',
        resources: isoKey,
        alsoLog: true,
        meta: { environments: input.environments },
      },
      this.translationService.deleteLanguage(isoKey),
    )
  }
}
