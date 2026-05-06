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
  PagedRowsDto,
  Translation,
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

import { CreateTranslationDto } from './dto/create-translation.dto'
import { PagedTranslationsDto } from './dto/paged-translations.dto'
import { UpdateTranslationDto } from './dto/update-translation.dto'
import { DeleteTranslationDto } from './dto/delete-translation.dto'

const namespace = '@island.is/auth/admin-api/v2/translations'

const translationResource = (
  translation: Pick<Translation, 'language' | 'className' | 'property' | 'key'>,
) =>
  `${translation.language}/${translation.className}/${translation.property}/${translation.key}`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/translations',
  version: ['2'],
})
@Audit({ namespace })
export class MeTranslationsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly translationService: TranslationService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get a paginated list of translations.',
    response: { status: 200, type: PagedTranslationsDto },
    request: {
      query: {
        searchString: {
          required: false,
          type: 'string',
          description: 'Search by value, key or className',
        },
        page: { required: true, type: 'number' },
        count: { required: true, type: 'number' },
      },
    },
  })
  @Audit<PagedRowsDto<Translation>>({
    resources: (result) => result.rows.map(translationResource),
  })
  findAndCountAll(
    @Query('searchString') searchString: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<PagedRowsDto<Translation>> {
    if (page < 1 || count < 1) {
      throw new BadRequestException('page and count must be positive integers')
    }

    return this.translationService.searchTranslations(searchString, page, count)
  }

  @Get(':language/:className/:property/:key')
  @Documentation({
    description: 'Get a translation by composite key.',
    response: { status: 200, type: Translation },
    includeNoContentResponse: true,
  })
  @Audit<Translation>({
    resources: (translation) => translation && translationResource(translation),
  })
  async findOne(
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

  @Post()
  @Documentation({
    description: 'Create a new translation.',
    response: { status: 201, type: Translation },
  })
  @Audit<Translation>({
    resources: translationResource,
    alsoLog: true,
  })
  create(@Body() input: CreateTranslationDto): Promise<Translation> {
    return this.translationService.upsertTranslation(input)
  }

  @Patch(':language/:className/:property/:key')
  @Documentation({
    description: 'Update an existing translation value.',
    response: { status: 200, type: Translation },
  })
  update(
    @CurrentUser() user: User,
    @Param('language') language: string,
    @Param('className') className: string,
    @Param('property') property: string,
    @Param('key') key: string,
    @Body() input: UpdateTranslationDto,
  ): Promise<Translation> {
    const resource = translationResource({ language, className, property, key })
    return this.auditService.auditPromise<Translation>(
      {
        namespace,
        auth: user,
        action: 'update',
        resources: resource,
        alsoLog: true,
        meta: { fields: ['value'] },
      },
      this.translationService.upsertTranslation({
        language,
        className,
        property,
        key,
        value: input.value,
      }),
    )
  }

  @Delete(':language/:className/:property/:key')
  @HttpCode(204)
  @Documentation({
    description: 'Delete a translation by composite key.',
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('language') language: string,
    @Param('className') className: string,
    @Param('property') property: string,
    @Param('key') key: string,
    @Body() input: DeleteTranslationDto,
  ): Promise<void> {
    const resource = translationResource({ language, className, property, key })
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'delete',
        resources: resource,
        alsoLog: true,
        meta: { environments: input.environments },
      },
      this.translationService.deleteTranslation({
        language,
        className,
        property,
        key,
      }),
    )
  }
}
